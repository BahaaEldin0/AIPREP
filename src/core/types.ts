// Core types for aiprep — public API surface.

export interface DetectedStack {
  /** e.g., "node", "python", "go", "rust", "php", "ruby", "java", "unknown" */
  runtime: string;
  /** e.g., "pnpm", "npm", "yarn", "bun", "pip", "poetry", "composer", "bundler", "maven", "gradle" */
  packageManager?: string;
  /** Detected frameworks with version hints. */
  frameworks: DetectedItem[];
  /** Detected tools/libraries. */
  tools: DetectedItem[];
  /** Project metadata (name, structure, scripts). */
  project: ProjectInfo;
}

export interface DetectedItem {
  /** Preset id matching a registry entry, e.g. "nextjs-approuter", "prisma". */
  id: string;
  /** Human-readable name. */
  name: string;
  /** Detected version string if available. */
  version?: string;
  /** 1.0 = certain, 0.5 = likely, 0.25 = guess. */
  confidence: number;
}

export interface ProjectInfo {
  /** Project name (from manifest or directory name). */
  name: string;
  /** Top-level directory tree (depth 2), formatted as path strings. */
  structure: string[];
  /** Build / dev / test / lint scripts extracted from package.json or Makefile. */
  scripts: Record<string, string>;
  /** Notable files at project root (e.g. Dockerfile, .env.example). */
  keyFiles: string[];
}

export interface Preset {
  /** Unique id matching DetectedItem.id. */
  id: string;
  /** Human-readable name. */
  name: string;
  /** One-line description shown in `aiprep list`. */
  description: string;
  /** Category for registry grouping. */
  type: PresetType;
  /** Active rules. */
  rules: Rule[];
  /** Rules included only when another preset is also active. */
  conditionalRules?: ConditionalRule[];
}

export type PresetType = 'meta' | 'framework' | 'tool';

export interface Rule {
  /** A clear, specific instruction the AI agent must follow. */
  content: string;
  /** Category for output grouping. */
  category: RuleCategory;
}

export type RuleCategory =
  | 'architecture'
  | 'conventions'
  | 'patterns'
  | 'errors'
  | 'testing'
  | 'security'
  | 'performance'
  | 'imports';

export interface ConditionalRule extends Rule {
  /** Only include this rule when the given preset id is also active. */
  when: string;
}

export type AgentFormat =
  | 'claude'
  | 'cursor'
  | 'agents'
  | 'copilot'
  | 'windsurf'
  | 'gemini';

export interface GenerateOptions {
  /** Which agent formats to output. Default: all. */
  agents?: AgentFormat[];
  /** Override detected presets. */
  presets?: string[];
  /** Project root directory. Default: process.cwd(). */
  cwd?: string;
  /** If true, do not write files; return content only. */
  dryRun?: boolean;
  /** Overwrite existing files without prompting. */
  force?: boolean;
}

export interface GenerateResult {
  /** Detected stack info. */
  stack: DetectedStack;
  /** Preset ids that were applied (in order). */
  appliedPresets: string[];
  /** Files that were written to disk. */
  writtenFiles: WrittenFile[];
  /** Files that already existed and were not overwritten (no --force). */
  skippedFiles: string[];
  /** Per-format generated content (always populated, even on dry run). */
  contents: Record<AgentFormat, string>;
}

export interface WrittenFile {
  path: string;
  agent: AgentFormat;
  size: number;
}
