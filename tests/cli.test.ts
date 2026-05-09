import { execSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const CLI = resolve(REPO_ROOT, 'dist/cli.js');
const FX = (n: string): string => resolve(REPO_ROOT, 'tests/fixtures', n);

function run(args: string, cwd: string): string {
  return execSync(`node "${CLI}" ${args}`, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

describe('aiprep CLI integration', () => {
  beforeAll(() => {
    if (!existsSync(CLI)) {
      // Build before tests if dist is missing.
      execSync('pnpm run build', { cwd: REPO_ROOT, stdio: 'ignore' });
    }
  });

  let tmp: string;
  beforeEach(() => {
    tmp = mkdtempSync(join(tmpdir(), 'aiprep-cli-'));
    writeFileSync(
      join(tmp, 'package.json'),
      readFileSync(join(FX('nextjs-app'), 'package.json'), 'utf8'),
    );
    mkdirSync(join(tmp, 'app'), { recursive: true });
    writeFileSync(join(tmp, 'app', 'page.tsx'), 'export default () => null');
    writeFileSync(join(tmp, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n');
  });
  afterEach(() => rmSync(tmp, { recursive: true, force: true }));

  it('list shows 43 presets', () => {
    const out = run('list', REPO_ROOT);
    expect(out).toMatch(/Total:\s+\d+\s+presets/);
    const total = Number(out.match(/Total:\s+(\d+)/)![1]);
    expect(total).toBeGreaterThanOrEqual(40);
  });

  it('init writes 6 files for a Next.js project', () => {
    run('init --force', tmp);
    expect(existsSync(join(tmp, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tmp, '.cursor/rules/aiprep.mdc'))).toBe(true);
    expect(existsSync(join(tmp, 'AGENTS.md'))).toBe(true);
    expect(existsSync(join(tmp, '.github/copilot-instructions.md'))).toBe(true);
    expect(existsSync(join(tmp, '.windsurfrules'))).toBe(true);
    expect(existsSync(join(tmp, 'GEMINI.md'))).toBe(true);
  });

  it('--agents filter writes only the selected formats', () => {
    run('init --force --agents claude,cursor', tmp);
    expect(existsSync(join(tmp, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(tmp, '.cursor/rules/aiprep.mdc'))).toBe(true);
    expect(existsSync(join(tmp, 'AGENTS.md'))).toBe(false);
    expect(existsSync(join(tmp, '.windsurfrules'))).toBe(false);
  });

  it('CLAUDE.md content includes Next.js App Router rules', () => {
    run('init --force', tmp);
    const claude = readFileSync(join(tmp, 'CLAUDE.md'), 'utf8');
    expect(claude).toMatch(/Server Component/);
    expect(claude).toMatch(/Next\.js \(App Router\)/);
    expect(claude).toMatch(/Prisma/);
    expect(claude).toMatch(/Tailwind/);
  });

  it('check command lists all 6 agent file paths', () => {
    const out = run('check', tmp);
    expect(out).toMatch(/CLAUDE\.md/);
    expect(out).toMatch(/\.cursor[\\/]rules[\\/]aiprep\.mdc/);
    expect(out).toMatch(/AGENTS\.md/);
    expect(out).toMatch(/copilot-instructions\.md/);
    expect(out).toMatch(/\.windsurfrules/);
    expect(out).toMatch(/GEMINI\.md/);
  });
});
