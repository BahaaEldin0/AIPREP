import type { DetectedItem } from '../core/types.js';

export async function detectGeneric(_cwd: string): Promise<{
  tools: DetectedItem[];
  keyFiles: string[];
}> {
  return { tools: [], keyFiles: [] };
}
