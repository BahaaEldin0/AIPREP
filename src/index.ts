// Public programmatic API for aiprep.

export { detectStack } from './core/detect.js';
export { composeRules } from './core/compose.js';
export { generate } from './core/generate.js';

export type {
  DetectedStack,
  DetectedItem,
  ProjectInfo,
  Preset,
  PresetType,
  Rule,
  RuleCategory,
  ConditionalRule,
  AgentFormat,
  GenerateOptions,
  GenerateResult,
  WrittenFile,
} from './core/types.js';

export {
  registerPreset,
  getPreset,
  getAllPresets,
  getPresetsByIds,
} from './presets/index.js';

export {
  registerFormatter,
  getFormatter,
  getAllFormats,
  AGENT_FILE_PATHS,
  AGENT_LABELS,
} from './formatters/index.js';
