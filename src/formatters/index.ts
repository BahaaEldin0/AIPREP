import type {
  AgentFormat,
  DetectedStack,
  ProjectInfo,
  Rule,
} from '../core/types.js';

export type FormatterFn = (
  rules: Rule[],
  stack: DetectedStack,
  project: ProjectInfo,
  appliedPresets: string[],
) => string;

const registry = new Map<AgentFormat, FormatterFn>();

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
