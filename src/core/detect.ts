import { existsSync, readdirSync, statSync } from 'node:fs';
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

/** Common subdirs to probe in monorepos. Listed once at root. */
const SCAN_DIRS = ['backend', 'frontend', 'server', 'client', 'api', 'web'] as const;
/** Workspace parent dirs whose immediate children are scanned. */
const WORKSPACE_PARENTS = ['apps', 'packages', 'services'] as const;

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

function listSubdirs(parent: string): string[] {
  if (!existsSync(parent)) return [];
  try {
    return readdirSync(parent)
      .map((name) => join(parent, name))
      .filter((p) => {
        try {
          return statSync(p).isDirectory();
        } catch {
          return false;
        }
      });
  } catch {
    return [];
  }
}

function collectScanDirs(cwd: string): string[] {
  const dirs: string[] = [];
  for (const sub of SCAN_DIRS) {
    const p = join(cwd, sub);
    if (existsSync(p)) dirs.push(p);
  }
  for (const parent of WORKSPACE_PARENTS) {
    dirs.push(...listSubdirs(join(cwd, parent)));
  }
  return dirs;
}

export async function detectStack(cwd: string): Promise<DetectedStack> {
  const [rootResults, generic] = await Promise.all([
    runLanguageDetectors(cwd),
    detectGeneric(cwd),
  ]);
  const subdirs = collectScanDirs(cwd);
  const subdirResults = await Promise.all(subdirs.map((d) => runLanguageDetectors(d)));

  const allResultGroups = [rootResults, ...subdirResults];

  // primary is the first non-null detector at root, in declaration order.
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
