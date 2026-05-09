import type { ComposedRules } from '../core/compose.js';
import type { DetectedStack, ProjectInfo } from '../core/types.js';
import {
  renderHeader,
  renderRulesByCategory,
  renderScripts,
  renderStructure,
  stackSummary,
} from './shared.js';

export function formatClaude(
  composed: ComposedRules,
  stack: DetectedStack,
  project: ProjectInfo,
): string {
  return [
    `# CLAUDE.md`,
    ``,
    renderHeader('Claude Code'),
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
    project.keyFiles.length ? `## Key Files\n\n${project.keyFiles.map((f) => `- \`${f}\``).join('\n')}` : '',
  ]
    .filter((s) => s !== null && s !== undefined)
    .join('\n');
}
