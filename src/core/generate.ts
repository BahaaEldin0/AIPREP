import type { GenerateOptions, GenerateResult } from './types.js';

/**
 * End-to-end: detect → compose → format → write. Implementation lands in Commit 10.
 */
export async function generate(_options: GenerateOptions = {}): Promise<GenerateResult> {
  throw new Error('generate: not yet implemented');
}
