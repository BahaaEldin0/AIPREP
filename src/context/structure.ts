import { readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

const SKIP = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  'out',
  '__pycache__',
  '.next',
  '.nuxt',
  '.svelte-kit',
  '.astro',
  'venv',
  '.venv',
  '.turbo',
  'target',
  'vendor',
  '.idea',
  '.vscode',
  'coverage',
  '.DS_Store',
]);

/**
 * Returns a list of relative paths up to `depth` levels deep.
 * Directories end with '/'. Skips lockfiles and common artifact folders.
 */
export async function readStructure(cwd: string, depth = 2): Promise<string[]> {
  const entries: string[] = [];
  walk(cwd, '', depth, entries);
  return entries.sort();
}

function walk(absRoot: string, relPath: string, remaining: number, out: string[]): void {
  const absDir = relPath ? join(absRoot, relPath) : absRoot;
  let names: string[];
  try {
    names = readdirSync(absDir);
  } catch {
    return;
  }
  for (const name of names) {
    if (SKIP.has(name) || name.startsWith('.') && name !== '.env.example') continue;
    const childRel = relPath ? `${relPath}/${name}` : name;
    const abs = join(absRoot, childRel);
    let isDir = false;
    try {
      isDir = statSync(abs).isDirectory();
    } catch {
      continue;
    }
    if (isDir) {
      out.push(`${childRel}/`);
      if (remaining > 1) walk(absRoot, childRel, remaining - 1, out);
    } else {
      out.push(childRel);
    }
  }
  void basename;
}
