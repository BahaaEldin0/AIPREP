import { readdirSync, type Dirent } from 'node:fs';
import { basename, join } from 'node:path';
import { readScripts } from '../context/scripts.js';
import { readStructure } from '../context/structure.js';
import { detectGeneric } from '../detectors/generic.js';
import { detectGo } from '../detectors/go.js';
import { detectJava } from '../detectors/java.js';
import { detectNode } from '../detectors/node.js';
import { detectPhp } from '../detectors/php.js';
import { detectPython } from '../detectors/python.js';
import { detectRuby } from '../detectors/ruby.js';
import { detectRust } from '../detectors/rust.js';
import type { DetectedItem, DetectedStack } from './types.js';

interface DetectorResult {
  runtime: string;
  packageManager?: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
  project?: { name?: string };
}

/** Files that signal "a real project lives in this directory". */
const MANIFEST_FILES = new Set([
  'package.json',
  'pyproject.toml',
  'requirements.txt',
  'go.mod',
  'Cargo.toml',
  'composer.json',
  'Gemfile',
  'pom.xml',
  'build.gradle',
  'build.gradle.kts',
]);

/** Directory names that never contain user-authored sources we want to detect. */
const SKIP_DIRS = new Set([
  'node_modules',
  'vendor',
  'target',
  'dist',
  'build',
  'out',
  'bin',
  'obj',
  'coverage',
  '__pycache__',
  'venv',
  'env',
  'tmp',
  'temp',
  'logs',
]);

/** Bound the walk so we never explode on pathological repos. */
const MAX_DEPTH = 4;
const MAX_DIRS_VISITED = 500;

async function runLanguageDetectors(dir: string): Promise<(DetectorResult | null)[]> {
  const [node, python, go, rust, php, ruby, java] = await Promise.all([
    detectNode(dir),
    detectPython(dir),
    detectGo(dir),
    detectRust(dir),
    detectPhp(dir),
    detectRuby(dir),
    detectJava(dir),
  ]);
  return [node, python, go, rust, php, ruby, java];
}

/**
 * Walk `root` (depth-bounded) and return every directory containing a
 * recognized manifest file. The walk skips known build/output dirs and any
 * hidden dir (name starts with '.'); folder names themselves are not gated
 * by an allowlist, so unknown layouts (templates/v3/foo, starter/, infra/api)
 * are discovered like any other.
 */
function findProjectDirs(root: string): string[] {
  const found: string[] = [];
  const stack: { dir: string; depth: number }[] = [{ dir: root, depth: 0 }];
  let visited = 0;

  while (stack.length > 0 && visited < MAX_DIRS_VISITED) {
    const { dir, depth } = stack.pop()!;
    visited++;

    let entries: Dirent[];
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const e of entries) {
      if (!e.isFile()) continue;
      if (MANIFEST_FILES.has(e.name)) {
        found.push(dir);
        break;
      }
    }

    if (depth >= MAX_DEPTH) continue;

    for (const e of entries) {
      if (!e.isDirectory()) continue;
      if (e.name.startsWith('.')) continue;
      if (SKIP_DIRS.has(e.name)) continue;
      stack.push({ dir: join(dir, e.name), depth: depth + 1 });
    }
  }

  return found;
}

export async function detectStack(cwd: string): Promise<DetectedStack> {
  const [rootResults, generic] = await Promise.all([
    runLanguageDetectors(cwd),
    detectGeneric(cwd),
  ]);

  const projectDirs = findProjectDirs(cwd).filter((d) => d !== cwd);
  const subdirResults = await Promise.all(projectDirs.map((d) => runLanguageDetectors(d)));

  const allResultGroups = [rootResults, ...subdirResults];

  // primary = first non-null detector at root, in declaration order.
  const primary = rootResults.find((d) => d !== null) ?? null;

  const runtimes: string[] = [];
  for (const group of allResultGroups) {
    for (const d of group) {
      if (d && !runtimes.includes(d.runtime)) runtimes.push(d.runtime);
    }
  }

  const frameworks: DetectedItem[] = [];
  const tools: DetectedItem[] = [];
  const seen = new Set<string>();

  for (const group of allResultGroups) {
    for (const d of group) {
      if (!d) continue;
      for (const f of d.frameworks) {
        if (!seen.has(`f:${f.id}`)) {
          frameworks.push(f);
          seen.add(`f:${f.id}`);
        }
      }
      for (const t of d.tools) {
        if (!seen.has(`t:${t.id}`)) {
          tools.push(t);
          seen.add(`t:${t.id}`);
        }
      }
    }
  }

  for (const t of generic.tools) {
    if (!seen.has(`t:${t.id}`)) {
      tools.push(t);
      seen.add(`t:${t.id}`);
    }
  }

  // packageManager: primary at root if any; otherwise first non-empty across roots+subdirs.
  let packageManager = primary?.packageManager;
  if (!packageManager) {
    for (const group of allResultGroups) {
      for (const d of group) {
        if (d?.packageManager) {
          packageManager = d.packageManager;
          break;
        }
      }
      if (packageManager) break;
    }
  }

  const scripts = await readScripts(cwd);
  const structure = await readStructure(cwd, 2);
  const projectName = (rootResults[0]?.project?.name ?? '') || basename(cwd);

  return {
    runtime: runtimes.length > 0 ? runtimes : ['unknown'],
    packageManager,
    frameworks,
    tools,
    project: {
      name: projectName,
      structure,
      scripts,
      keyFiles: generic.keyFiles,
    },
  };
}
