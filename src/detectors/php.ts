import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

export async function detectPhp(cwd: string): Promise<{
  runtime: string;
  packageManager: string;
  frameworks: DetectedItem[];
  tools: DetectedItem[];
} | null> {
  const composerPath = join(cwd, 'composer.json');
  if (!existsSync(composerPath)) return null;

  let composer: { require?: Record<string, string>; ['require-dev']?: Record<string, string> };
  try {
    composer = JSON.parse(readFileSync(composerPath, 'utf8'));
  } catch {
    return null;
  }

  const deps = { ...composer.require, ...composer['require-dev'] };
  const frameworks: DetectedItem[] = [];

  if ('laravel/framework' in deps) {
    frameworks.push({
      id: 'laravel',
      name: 'Laravel',
      version: deps['laravel/framework']?.replace(/^[\^~]/, ''),
      confidence: 1,
    });
  }

  return { runtime: 'php', packageManager: 'composer', frameworks, tools: [] };
}
