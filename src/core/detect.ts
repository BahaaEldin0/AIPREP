import type { DetectedStack } from './types.js';

/**
 * Orchestrator: runs all language-specific detectors and merges their results.
 * Implementation lands in Commit 3.
 */
export async function detectStack(_cwd: string): Promise<DetectedStack> {
  throw new Error('detectStack: not yet implemented');
}
