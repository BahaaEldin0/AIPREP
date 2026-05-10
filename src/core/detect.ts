import { basename } from 'node:path';
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

export async function detectStack(cwd: string): Promise<DetectedStack> {
  const [node, python, go, rust, php, ruby, java, generic] = await Promise.all([
    detectNode(cwd),
    detectPython(cwd),
    detectGo(cwd),
    detectRust(cwd),
    detectPhp(cwd),
    detectRuby(cwd),
    detectJava(cwd),
    detectGeneric(cwd),
  ]);

  const orderedDetectors = [node, python, go, rust, php, ruby, java] as const;
  const primary = orderedDetectors.find((d) => d !== null) ?? null;

  const runtimes: string[] = [];
  for (const d of orderedDetectors) {
    if (d && !runtimes.includes(d.runtime)) runtimes.push(d.runtime);
  }

  const frameworks: DetectedItem[] = [];
  const tools: DetectedItem[] = [];
  const seen = new Set<string>();

  for (const detector of orderedDetectors) {
    if (!detector) continue;
    for (const f of detector.frameworks) {
      if (!seen.has(`f:${f.id}`)) {
        frameworks.push(f);
        seen.add(`f:${f.id}`);
      }
    }
    for (const t of detector.tools) {
      if (!seen.has(`t:${t.id}`)) {
        tools.push(t);
        seen.add(`t:${t.id}`);
      }
    }
  }

  for (const t of generic.tools) {
    if (!seen.has(`t:${t.id}`)) {
      tools.push(t);
      seen.add(`t:${t.id}`);
    }
  }

  const scripts = await readScripts(cwd);
  const structure = await readStructure(cwd, 2);
  const projectName = (node?.project.name ?? '') || basename(cwd);

  return {
    runtime: runtimes.length > 0 ? runtimes : ['unknown'],
    packageManager: primary?.packageManager,
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
