import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

function readDepsFromPyproject(text: string): string[] {
  const deps: string[] = [];
  // Capture both [project].dependencies = [...] and [tool.poetry.dependencies] sections.
  const projectArr = text.match(/dependencies\s*=\s*\[([\s\S]*?)\]/);
  if (projectArr?.[1]) {
    for (const m of projectArr[1].matchAll(/"([^"<>=!~]+)/g)) {
      if (m[1]) deps.push(m[1].trim().toLowerCase());
    }
  }
  const poetrySection = text.match(/\[tool\.poetry\.dependencies\]([\s\S]*?)(?=\n\[|$)/);
  if (poetrySection?.[1]) {
    for (const line of poetrySection[1].split('\n')) {
      const m = line.match(/^([A-Za-z0-9_.\-]+)\s*=/);
      if (m?.[1] && m[1].toLowerCase() !== 'python') deps.push(m[1].toLowerCase());
    }
  }
  return deps;
}

function readDepsFromRequirements(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('-'))
    .map((l) => l.split(/[<>=!~\s;]/)[0]?.toLowerCase() ?? '')
    .filter(Boolean);
}

export async function detectPython(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const pyproject = join(cwd, 'pyproject.toml');
  const requirements = join(cwd, 'requirements.txt');
  let deps: string[] = [];

  if (existsSync(pyproject)) {
    deps = readDepsFromPyproject(readFileSync(pyproject, 'utf8'));
  } else if (existsSync(requirements)) {
    deps = readDepsFromRequirements(readFileSync(requirements, 'utf8'));
  } else {
    return null;
  }

  const has = (name: string): boolean => deps.includes(name.toLowerCase());
  const frameworks: DetectedItem[] = [];
  const tools: DetectedItem[] = [];

  if (has('django')) frameworks.push({ id: 'django', name: 'Django', confidence: 1 });
  if (has('fastapi')) frameworks.push({ id: 'fastapi', name: 'FastAPI', confidence: 1 });
  if (has('flask')) frameworks.push({ id: 'flask', name: 'Flask', confidence: 1 });
  if (has('pytest')) tools.push({ id: 'pytest', name: 'pytest', confidence: 1 });

  let packageManager = 'pip';
  if (existsSync(join(cwd, 'poetry.lock'))) packageManager = 'poetry';
  else if (existsSync(join(cwd, 'Pipfile.lock'))) packageManager = 'pipenv';
  else if (existsSync(join(cwd, 'uv.lock'))) packageManager = 'uv';

  return { runtime: 'python', packageManager, frameworks, tools };
}
