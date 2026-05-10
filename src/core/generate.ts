import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  AGENT_FILE_PATHS,
  FORMATS_WITH_PRESERVATION,
  getAllFormats,
  getFormatter,
} from '../formatters/index.js';
import { mergeWithMarker } from '../formatters/shared.js';
import { buildIdList, composeFromIds } from './compose.js';
import { detectStack } from './detect.js';
import type {
  AgentFormat,
  DetectedStack,
  GenerateOptions,
  GenerateResult,
  WrittenFile,
} from './types.js';

const ALL_FORMATS: AgentFormat[] = ['claude', 'cursor', 'agents', 'copilot', 'windsurf', 'gemini'];

export async function generate(options: GenerateOptions = {}): Promise<GenerateResult> {
  const cwd = resolve(options.cwd ?? process.cwd());
  const stack: DetectedStack = await detectStack(cwd);

  const presetIds = options.presets ?? buildIdList(stack);
  const composed = composeFromIds(presetIds);

  const formats = options.agents && options.agents.length > 0 ? options.agents : ALL_FORMATS;

  const contents = {} as Record<AgentFormat, string>;
  const writtenFiles: WrittenFile[] = [];
  const skippedFiles: string[] = [];
  const warnings: string[] = [];

  for (const format of formats) {
    const fn = getFormatter(format);
    if (!fn) continue;

    let body = fn(composed, stack, stack.project);
    const relPath = AGENT_FILE_PATHS[format];
    const absPath = join(cwd, relPath);

    if (FORMATS_WITH_PRESERVATION.includes(format)) {
      const existing = existsSync(absPath) ? readFileSync(absPath, 'utf8') : null;
      const merged = mergeWithMarker(body, existing);
      body = merged.result;

      if (merged.backupRequired) {
        const backupPath = `${absPath}.bak.${Date.now()}`;
        if (!options.dryRun) {
          copyFileSync(absPath, backupPath);
        }
        warnings.push(
          `${relPath}: preservation marker missing — prior content backed up to ${relPath}.bak.<timestamp>`,
        );
      }
    }

    contents[format] = body;

    if (options.dryRun) continue;

    if (existsSync(absPath) && !options.force && !FORMATS_WITH_PRESERVATION.includes(format)) {
      skippedFiles.push(relPath);
      continue;
    }

    mkdirSync(dirname(absPath), { recursive: true });
    writeFileSync(absPath, body, 'utf8');
    writtenFiles.push({
      path: relPath,
      agent: format,
      size: Buffer.byteLength(body, 'utf8'),
    });
  }

  // Ensure all known formats have an entry in `contents` (even if not selected, leave undefined-safe access).
  for (const f of getAllFormats()) {
    if (!(f in contents)) {
      contents[f] = '';
    }
  }

  return {
    stack,
    appliedPresets: composed.appliedPresets,
    writtenFiles,
    skippedFiles,
    contents,
    warnings,
  };
}
