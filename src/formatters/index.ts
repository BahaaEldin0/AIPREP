import type { ComposedRules } from '../core/compose.js';
import type {
  AgentFormat,
  DetectedStack,
  ProjectInfo,
} from '../core/types.js';
import { formatAgents } from './agents.js';
import { formatClaude } from './claude.js';
import { formatCopilot } from './copilot.js';
import { formatCursor } from './cursor.js';
import { formatGemini } from './gemini.js';
import { formatWindsurf } from './windsurf.js';

export type FormatterFn = (
  composed: ComposedRules,
  stack: DetectedStack,
  project: ProjectInfo,
) => string;

const registry = new Map<AgentFormat, FormatterFn>([
  ['claude', formatClaude],
  ['cursor', formatCursor],
  ['agents', formatAgents],
  ['copilot', formatCopilot],
  ['windsurf', formatWindsurf],
  ['gemini', formatGemini],
]);

export function registerFormatter(format: AgentFormat, fn: FormatterFn): void {
  registry.set(format, fn);
}

export function getFormatter(format: AgentFormat): FormatterFn | undefined {
  return registry.get(format);
}

export function getAllFormats(): AgentFormat[] {
  return Array.from(registry.keys());
}

export const AGENT_FILE_PATHS: Record<AgentFormat, string> = {
  claude: 'CLAUDE.md',
  cursor: '.cursor/rules/aiprep.mdc',
  agents: 'AGENTS.md',
  copilot: '.github/copilot-instructions.md',
  windsurf: '.windsurfrules',
  gemini: 'GEMINI.md',
};

export const AGENT_LABELS: Record<AgentFormat, string> = {
  claude: 'Claude Code',
  cursor: 'Cursor',
  agents: 'Codex / Universal',
  copilot: 'GitHub Copilot',
  windsurf: 'Windsurf',
  gemini: 'Gemini CLI',
};

export const FORMATS_WITH_PRESERVATION: AgentFormat[] = ['claude', 'gemini'];
