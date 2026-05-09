import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

export async function detectRuby(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const gemfile = join(cwd, 'Gemfile');
  if (!existsSync(gemfile)) return null;

  const text = readFileSync(gemfile, 'utf8');
  const frameworks: DetectedItem[] = [];

  if (/^\s*gem\s+["']rails["']/m.test(text)) {
    const m = text.match(/^\s*gem\s+["']rails["'][^,\n]*,\s*["']([^"']+)["']/m);
    frameworks.push({ id: 'rails', name: 'Ruby on Rails', version: m?.[1], confidence: 1 });
  }

  return { runtime: 'ruby', packageManager: 'bundler', frameworks, tools: [] };
}
