import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

export async function detectRust(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const cargoPath = join(cwd, 'Cargo.toml');
  if (!existsSync(cargoPath)) return null;

  const text = readFileSync(cargoPath, 'utf8');
  const depsSection = text.match(/\[dependencies\]([\s\S]*?)(?=\n\[|$)/)?.[1] ?? '';
  const has = (needle: string): boolean =>
    new RegExp(`^\\s*${needle}\\s*=`, 'm').test(depsSection);

  const frameworks: DetectedItem[] = [];
  if (has('axum')) frameworks.push({ id: 'rust-axum', name: 'Axum', confidence: 1 });

  return { runtime: 'rust', packageManager: 'cargo', frameworks, tools: [] };
}
