import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export async function readScripts(cwd: string): Promise<Record<string, string>> {
  const scripts: Record<string, string> = {};

  const pkgPath = join(cwd, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8')) as { scripts?: Record<string, string> };
      Object.assign(scripts, pkg.scripts ?? {});
    } catch {
      // ignore malformed
    }
  }

  const makefile = join(cwd, 'Makefile');
  if (existsSync(makefile)) {
    const text = readFileSync(makefile, 'utf8');
    for (const m of text.matchAll(/^([A-Za-z0-9_\-]+):/gm)) {
      const target = m[1];
      if (target && !target.startsWith('.') && !(target in scripts)) {
        scripts[target] = `make ${target}`;
      }
    }
  }

  return scripts;
}
