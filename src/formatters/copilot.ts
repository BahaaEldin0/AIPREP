import type { ComposedRules } from '../core/compose.js';
import type { DetectedStack } from '../core/types.js';
import { renderHeader, renderRulesByCategory, stackSummary } from './shared.js';

export function formatCopilot(composed: ComposedRules, stack: DetectedStack): string {
  return [
    `# Copilot Instructions`,
    ``,
    `> These instructions are read by GitHub Copilot.`,
    ``,
    renderHeader('GitHub Copilot'),
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
