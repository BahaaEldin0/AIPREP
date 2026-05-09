import type { ComposedRules } from '../core/compose.js';
import type { DetectedStack } from '../core/types.js';
import { renderHeader, renderRulesByCategory, stackSummary } from './shared.js';

export function formatAgents(composed: ComposedRules, stack: DetectedStack): string {
  return [
    `# AGENTS.md`,
    ``,
    renderHeader('Codex / Universal'),
    ``,
    `**Stack:** ${stackSummary(stack) || 'unknown'}`,
    `**Presets:** ${composed.appliedPresets.join(', ')}`,
    ``,
    `## Coding Rules`,
    ``,
    renderRulesByCategory(composed.byCategory),
    ``,
  ].join('\n');
}
