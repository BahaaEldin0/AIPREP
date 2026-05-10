import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

type DepMap = Map<string, string | undefined>;

function stripVersionPrefix(v: string): string {
  return v.replace(/^[\^~>=<!]+/, '').trim();
}

function readDepsFromPyproject(text: string): DepMap {
  const deps: DepMap = new Map();

  // PEP 621 `[project] dependencies = ["pkg>=1.0", ...]`.
  const projectArr = text.match(/dependencies\s*=\s*\[([\s\S]*?)\]/);
  if (projectArr?.[1]) {
    for (const m of projectArr[1].matchAll(/"([^"]+)"/g)) {
      const raw = m[1]?.trim();
      if (!raw) continue;
      // Split off the package name (incl. extras) from the version specifier.
      const split = raw.match(/^([A-Za-z0-9_.\-]+)(?:\[[^\]]*\])?\s*(.*)$/);
      if (!split?.[1]) continue;
      const name = split[1].toLowerCase();
      const rest = (split[2] ?? '').trim();
      const ver = rest ? stripVersionPrefix(rest) : undefined;
      if (!deps.has(name)) deps.set(name, ver || undefined);
    }
  }

  // Poetry `[tool.poetry.dependencies]` table — `pkg = "^1.0"` or `pkg = { version = "^1.0", ... }`.
  const poetrySection = text.match(/\[tool\.poetry\.dependencies\]([\s\S]*?)(?=\n\[|$)/);
  if (poetrySection?.[1]) {
    const lineRe =
      /^([A-Za-z0-9_.\-]+)\s*=\s*(?:"([^"]+)"|\{[^}]*\bversion\s*=\s*"([^"]+)"[^}]*\})/gm;
    for (const m of poetrySection[1].matchAll(lineRe)) {
      const name = m[1]?.toLowerCase();
      if (!name || name === 'python') continue;
      const ver = m[2] ?? m[3];
      if (!deps.has(name)) deps.set(name, ver ? stripVersionPrefix(ver) : undefined);
    }
  }

  return deps;
}

function readDepsFromRequirements(text: string): DepMap {
  const deps: DepMap = new Map();
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('-')) continue;
    // Drop env markers (after ;) before splitting on operators.
    const head = line.split(';')[0]?.trim() ?? '';
    const m = head.match(/^([A-Za-z0-9_.\-]+)(?:\[[^\]]*\])?\s*(.*)$/);
    if (!m?.[1]) continue;
    const name = m[1].toLowerCase();
    const rest = (m[2] ?? '').trim();
    let ver: string | undefined;
    if (rest) {
      // Take the version from the first comparator; e.g. ">=0.115.0,<1.0" -> "0.115.0".
      const verMatch = rest.match(/(?:==|>=|~=|!=|<=|<|>)\s*([A-Za-z0-9_.\-+*]+)/);
      ver = verMatch?.[1];
    }
    if (!deps.has(name)) deps.set(name, ver);
  }
  return deps;
}

function makeItem(
  id: string,
  name: string,
  version: string | undefined,
  confidence = 1,
): DetectedItem {
  return version ? { id, name, version, confidence } : { id, name, confidence };
}

export async function detectPython(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const pyproject = join(cwd, 'pyproject.toml');
  const requirements = join(cwd, 'requirements.txt');
  let deps: DepMap;

  if (existsSync(pyproject)) {
    deps = readDepsFromPyproject(readFileSync(pyproject, 'utf8'));
  } else if (existsSync(requirements)) {
    deps = readDepsFromRequirements(readFileSync(requirements, 'utf8'));
  } else {
    return null;
  }

  const has = (name: string): boolean => deps.has(name.toLowerCase());
  const ver = (name: string): string | undefined => deps.get(name.toLowerCase());
  const frameworks: DetectedItem[] = [];
  const tools: DetectedItem[] = [];

  if (has('django')) frameworks.push(makeItem('django', 'Django', ver('django')));
  if (has('fastapi')) frameworks.push(makeItem('fastapi', 'FastAPI', ver('fastapi')));
  if (has('flask')) frameworks.push(makeItem('flask', 'Flask', ver('flask')));
  if (has('pytest')) tools.push(makeItem('pytest', 'pytest', ver('pytest')));

  let packageManager = 'pip';
  if (existsSync(join(cwd, 'poetry.lock'))) packageManager = 'poetry';
  else if (existsSync(join(cwd, 'Pipfile.lock'))) packageManager = 'pipenv';
  else if (existsSync(join(cwd, 'uv.lock'))) packageManager = 'uv';

  return { runtime: 'python', packageManager, frameworks, tools };
}
