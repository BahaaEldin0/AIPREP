import type { DetectedStack, Rule } from './types.js';

/**
 * Resolves a DetectedStack into a flat, deduplicated, ordered list of Rules.
 * Implementation lands in Commit 9.
 */
export function composeRules(_stack: DetectedStack): {
  rules: Rule[];
  appliedPresets: string[];
} {
  throw new Error('composeRules: not yet implemented');
}
