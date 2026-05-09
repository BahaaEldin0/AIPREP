import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { DetectedItem } from '../core/types.js';

export async function detectGeneric(cwd: string): Promise<{
  tools: DetectedItem[];
  keyFiles: string[];
}> {
  const tools: DetectedItem[] = [];
  const keyFiles: string[] = [];

  const has = (rel: string): boolean => existsSync(join(cwd, rel));

  if (has('Dockerfile') || has('docker-compose.yml') || has('docker-compose.yaml') || has('compose.yaml')) {
    tools.push({ id: 'docker', name: 'Docker', confidence: 1 });
    if (has('Dockerfile')) keyFiles.push('Dockerfile');
    if (has('docker-compose.yml')) keyFiles.push('docker-compose.yml');
    if (has('docker-compose.yaml')) keyFiles.push('docker-compose.yaml');
    if (has('compose.yaml')) keyFiles.push('compose.yaml');
  }
  if (has('turbo.json')) {
    tools.push({ id: 'monorepo-turborepo', name: 'Turborepo', confidence: 1 });
    keyFiles.push('turbo.json');
  }
  if (has('Makefile')) keyFiles.push('Makefile');
  if (has('.env.example')) keyFiles.push('.env.example');
  if (has('README.md')) keyFiles.push('README.md');

  return { tools, keyFiles };
}
