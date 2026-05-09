import type { ComposedRules } from '../core/compose.js';
import type { DetectedStack, ProjectInfo } from '../core/types.js';
import {
  renderHeader,
  renderRulesByCategory,
  renderScripts,
  renderStructure,
  stackSummary,
} from './shared.js';

export function formatGemini(
  composed: ComposedRules,
  stack: DetectedStack,
  project: ProjectInfo,
): string {
  return [
    `# GEMINI.md`,
    ``,
    renderHeader('Gemini CLI'),
    ``,
    `## Project Overview`,
    ``,
    `- **Name:** ${project.name || '(unnamed)'}`,
    `- **Stack:** ${stackSummary(stack) || 'unknown'}`,
    `- **Package Manager:** ${stack.packageManager ?? 'n/a'}`,
    ``,
    `## Build & Development Commands`,
    ``,
    renderScripts(project.scripts),
    ``,
    `## Coding Rules`,
    ``,
    `Applied presets: ${composed.appliedPresets.join(', ')}.`,
    ``,
    renderRulesByCategory(composed.byCategory),
    ``,
    `## Project Structure`,
    ``,
    renderStructure(project.structure),
    ``,
  ].join('\n');
}
