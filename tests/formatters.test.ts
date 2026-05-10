import { mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { generate } from '../src/core/generate.js';
import { composeRules } from '../src/core/compose.js';
import {
  formatAgents,
  formatClaude,
  formatCopilot,
  formatCursor,
  formatGemini,
  formatWindsurf,
} from '../src/formatters/agents.js';
import { CUSTOM_MARKER, appendCustomBlock } from '../src/formatters/shared.js';
import type { DetectedStack } from '../src/core/types.js';

// Re-export the formatters via the index — actual import:
import { formatAgents as fAgents } from '../src/formatters/agents.js';
import { formatClaude as fClaude } from '../src/formatters/claude.js';
import { formatCursor as fCursor } from '../src/formatters/cursor.js';
import { formatCopilot as fCopilot } from '../src/formatters/copilot.js';
import { formatWindsurf as fWindsurf } from '../src/formatters/windsurf.js';
import { formatGemini as fGemini } from '../src/formatters/gemini.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fx = (name: string): string => resolve(__dirname, 'fixtures', name);

function sampleStack(): DetectedStack {
  return {
    runtime: ['node'],
    packageManager: 'pnpm',
    frameworks: [{ id: 'express', name: 'Express', version: '4.21.0', confidence: 1 }],
    tools: [{ id: 'typescript', name: 'TypeScript', version: '5.6.3', confidence: 1 }],
    project: {
      name: 'my-app',
      structure: ['src/', 'src/index.ts', 'package.json'],
      scripts: { dev: 'tsx watch src/index.ts', build: 'tsc' },
      keyFiles: ['Dockerfile'],
    },
  };
}

describe('formatters — output structure', () => {
  const composed = composeRules(sampleStack());
  const stack = sampleStack();

  it('claude formatter produces CLAUDE.md with all sections', () => {
    const out = fClaude(composed, stack, stack.project);
    expect(out).toContain('# CLAUDE.md');
    expect(out).toContain('Claude Code');
    expect(out).toContain('## Project Overview');
    expect(out).toContain('## Coding Rules');
    expect(out).toContain('## Project Structure');
    expect(out).toContain('Express 4.21.0');
  });

  it('cursor formatter produces .mdc with YAML frontmatter', () => {
    const out = fCursor(composed, stack);
    expect(out.startsWith('---')).toBe(true);
    expect(out).toContain('alwaysApply: true');
    expect(out).toContain('description:');
  });

  it('agents formatter produces concise AGENTS.md', () => {
    const out = fAgents(composed, stack);
    expect(out).toContain('# AGENTS.md');
    expect(out).toContain('## Coding Rules');
    expect(out).not.toContain('## Project Structure'); // intentionally omitted
  });

  it('copilot formatter notes the consumer', () => {
    const out = fCopilot(composed, stack);
    expect(out).toContain('# Copilot Instructions');
    expect(out).toContain('GitHub Copilot');
  });

  it('windsurf formatter is plain markdown without YAML', () => {
    const out = fWindsurf(composed, stack);
    expect(out).toContain('# Windsurf Rules');
    expect(out.startsWith('---')).toBe(false);
  });

  it('gemini formatter mirrors CLAUDE.md structure', () => {
    const out = fGemini(composed, stack, stack.project);
    expect(out).toContain('# GEMINI.md');
    expect(out).toContain('## Project Overview');
    expect(out).toContain('## Project Structure');
  });
});

describe('appendCustomBlock — preservation', () => {
  it('appends marker on fresh file', () => {
    const result = appendCustomBlock('# Header\n\nbody', null);
    expect(result).toContain(CUSTOM_MARKER);
    expect(result.endsWith('\n')).toBe(true);
  });

  it('preserves content below marker on regeneration', () => {
    const existing = `# old\n\n${CUSTOM_MARKER}\n## My custom rules\n\n- never delete this`;
    const fresh = `# new`;
    const result = appendCustomBlock(fresh, existing);
    expect(result).toContain('# new');
    expect(result).toContain('## My custom rules');
    expect(result).toContain('never delete this');
    expect(result).not.toContain('# old');
  });

  it('handles existing file without marker (treats as fresh)', () => {
    const existing = '# something else without marker';
    const result = appendCustomBlock('# new', existing);
    expect(result).toContain(CUSTOM_MARKER);
    expect(result).not.toContain('# something else');
  });
});

describe('generate() integration', () => {
  let tmp: string;

  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aiprep-test-'));
    // Copy minimal Next.js fixture into tmp.
    writeFileSync(
      join(tmp, 'package.json'),
      readFileSync(join(fx('nextjs-app'), 'package.json'), 'utf8'),
    );
    mkdirSync(join(tmp, 'app'), { recursive: true });
    writeFileSync(join(tmp, 'app', 'page.tsx'), 'export default function P() { return null }');
    writeFileSync(join(tmp, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n');
  });

  afterEach(() => {
    rmSync(tmp, { recursive: true, force: true });
  });

  it('writes 6 agent files for a Next.js project', async () => {
    const result = await generate({ cwd: tmp });
    expect(result.writtenFiles.length).toBe(6);
    expect(result.appliedPresets).toContain('nextjs-approuter');
    expect(result.appliedPresets).toContain('prisma');
    expect(result.appliedPresets).toContain('tailwind');

    for (const wf of result.writtenFiles) {
      const content = readFileSync(join(tmp, wf.path), 'utf8');
      expect(content.length).toBeGreaterThan(100);
    }
  });

  it('--dry-run produces contents but writes nothing', async () => {
    const result = await generate({ cwd: tmp, dryRun: true });
    expect(result.writtenFiles.length).toBe(0);
    expect(result.contents.claude.length).toBeGreaterThan(0);
    expect(result.contents.cursor.length).toBeGreaterThan(0);
  });

  it('--agents filter only writes the requested formats', async () => {
    const result = await generate({ cwd: tmp, agents: ['claude', 'cursor'] });
    expect(result.writtenFiles.map((f) => f.agent).sort()).toEqual(['claude', 'cursor']);
  });

  it('preserves CLAUDE.md custom block on regeneration', async () => {
    await generate({ cwd: tmp, agents: ['claude'] });
    const first = readFileSync(join(tmp, 'CLAUDE.md'), 'utf8');
    expect(first).toContain(CUSTOM_MARKER);

    // Append custom content after the marker.
    writeFileSync(
      join(tmp, 'CLAUDE.md'),
      `${first}\n## My custom rules\n\n- always use 4 spaces`,
      'utf8',
    );

    await generate({ cwd: tmp, agents: ['claude'] });
    const second = readFileSync(join(tmp, 'CLAUDE.md'), 'utf8');
    expect(second).toContain('## My custom rules');
    expect(second).toContain('always use 4 spaces');
  });

  it('--force overwrites non-preservation files', async () => {
    await generate({ cwd: tmp, agents: ['windsurf'] });
    const first = readFileSync(join(tmp, '.windsurfrules'), 'utf8');

    // Edit it
    writeFileSync(join(tmp, '.windsurfrules'), 'TAINTED', 'utf8');

    // Without force: should skip (file exists, no preservation)
    const skipResult = await generate({ cwd: tmp, agents: ['windsurf'] });
    expect(skipResult.skippedFiles).toContain('.windsurfrules');
    expect(readFileSync(join(tmp, '.windsurfrules'), 'utf8')).toBe('TAINTED');

    // With force: should overwrite
    await generate({ cwd: tmp, agents: ['windsurf'], force: true });
    const afterForce = readFileSync(join(tmp, '.windsurfrules'), 'utf8');
    expect(afterForce).not.toBe('TAINTED');
    expect(afterForce.length).toBeGreaterThan(first.length / 2);
  });

  it('--presets override skips detection and applies given preset list', async () => {
    const result = await generate({
      cwd: tmp,
      presets: ['base', 'express'],
      dryRun: true,
    });
    expect(result.appliedPresets).toEqual(['base', 'express']);
    expect(result.appliedPresets).not.toContain('nextjs-approuter');
  });
});

// Sanity-check imports compile (the duplicate import lines above are
// intentional — the test file consumes formatters via two paths).
void formatAgents;
void formatClaude;
void formatCopilot;
void formatCursor;
void formatGemini;
void formatWindsurf;
