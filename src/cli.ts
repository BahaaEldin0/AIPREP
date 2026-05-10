import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { detectStack } from './core/detect.js';
import { generate } from './core/generate.js';
import { getAllPresets } from './presets/index.js';
import { AGENT_FILE_PATHS, AGENT_LABELS } from './formatters/index.js';
import type { AgentFormat } from './core/types.js';

const VERSION = '0.2.0';

function banner(): string {
  return boxen(
    `${chalk.bold.cyan('⚡ aiprep')} ${chalk.dim(`v${VERSION}`)}\n${chalk.dim('AI agent rules, zero effort')}`,
    {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: 'round',
      borderColor: 'cyan',
    },
  );
}

function parseList<T extends string>(input: string | undefined): T[] | undefined {
  if (!input) return undefined;
  return input
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean) as T[];
}

const VALID_AGENTS = new Set<AgentFormat>([
  'claude',
  'cursor',
  'agents',
  'copilot',
  'windsurf',
  'gemini',
]);

function parseAgents(input: string | undefined): AgentFormat[] | undefined {
  const list = parseList<string>(input);
  if (!list) return undefined;
  const out: AgentFormat[] = [];
  for (const a of list) {
    if (!VALID_AGENTS.has(a as AgentFormat)) {
      console.error(chalk.red(`error: unknown agent format "${a}"`));
      console.error(chalk.dim(`  valid: ${[...VALID_AGENTS].join(', ')}`));
      process.exit(2);
    }
    out.push(a as AgentFormat);
  }
  return out;
}

const program = new Command();

program
  .name('aiprep')
  .description('Detect your stack, generate AI coding rules for every agent in 5 seconds.')
  .version(VERSION);

program
  .command('init', { isDefault: true })
  .description('Auto-detect the stack and generate AI agent config files.')
  .option('--presets <list>', 'comma-separated preset ids (overrides auto-detection)')
  .option('--agents <list>', `comma-separated agent formats (default: all six)`)
  .option('--force', 'overwrite existing files (does not affect CLAUDE.md/GEMINI.md preservation)')
  .option('--dry-run', 'preview output without writing files')
  .option('--cwd <dir>', 'project directory (default: current directory)')
  .action(async (opts) => {
    const cwd = resolve(opts.cwd ?? process.cwd());
    process.stdout.write(banner());

    const detectSpinner = ora({ text: 'Detecting stack...', color: 'cyan' }).start();
    const stack = await detectStack(cwd);
    detectSpinner.succeed(chalk.bold('Detected:'));

    const detected: { label: string; meta?: string }[] = [];
    const runtimes = stack.runtime.filter((r) => r !== 'unknown');
    runtimes.forEach((rt, i) => {
      detected.push({
        label: rt,
        meta: i === 0 && stack.packageManager ? stack.packageManager : undefined,
      });
    });
    for (const f of stack.frameworks) {
      detected.push({ label: f.name, meta: f.version });
    }
    for (const t of stack.tools) {
      detected.push({ label: t.name, meta: t.version });
    }

    if (detected.length === 0) {
      console.log(chalk.yellow('  ! no stack detected — only base preset will apply'));
    } else {
      for (const d of detected) {
        const meta = d.meta ? chalk.dim(`(${d.meta})`) : '';
        console.log(`  ${chalk.green('✓')} ${chalk.cyan(d.label.padEnd(20))} ${meta}`);
      }
    }
    console.log('');

    const genSpinner = ora({
      text: opts.dryRun ? 'Composing rules (dry run)...' : 'Generating rules...',
      color: 'cyan',
    }).start();

    let result;
    try {
      result = await generate({
        cwd,
        presets: parseList<string>(opts.presets),
        agents: parseAgents(opts.agents),
        force: Boolean(opts.force),
        dryRun: Boolean(opts.dryRun),
      });
    } catch (err) {
      genSpinner.fail(chalk.red('Generation failed'));
      const msg = err instanceof Error ? err.message : String(err);
      console.error(chalk.red(msg));
      process.exit(1);
    }

    genSpinner.succeed(chalk.bold(opts.dryRun ? 'Composed:' : 'Generated:'));

    console.log(
      `  ${chalk.dim('Applied presets:')} ${chalk.cyan(result.appliedPresets.join(', '))}`,
    );
    console.log('');

    if (opts.dryRun) {
      // Dump every generated file's content with a separator.
      for (const [agent, content] of Object.entries(result.contents)) {
        if (!content) continue;
        const path = AGENT_FILE_PATHS[agent as AgentFormat];
        console.log(chalk.bold.cyan(`── ${path} (${AGENT_LABELS[agent as AgentFormat]}) ──`));
        console.log(content);
        console.log('');
      }
    } else {
      for (const wf of result.writtenFiles) {
        const sizeKb = (wf.size / 1024).toFixed(1);
        console.log(
          `  ${chalk.green('✓')} ${chalk.cyan(wf.path.padEnd(40))} ${chalk.dim(`(${AGENT_LABELS[wf.agent]}, ${sizeKb} KB)`)}`,
        );
      }
      for (const sf of result.skippedFiles) {
        console.log(
          `  ${chalk.yellow('!')} ${chalk.cyan(sf.padEnd(40))} ${chalk.dim('(exists; rerun with --force to overwrite)')}`,
        );
      }
    }

    const ruleCount = Object.values(result.contents).reduce(
      (acc, c) => acc + (c ? c.split('\n').filter((l) => l.startsWith('- ')).length : 0),
      0,
    );
    void ruleCount;

    console.log('');
    console.log(
      `  ${chalk.bold('Applied')} ${chalk.cyan(String(result.appliedPresets.length))} ${chalk.bold('presets')} across ${chalk.cyan(String(result.writtenFiles.length || Object.keys(result.contents).filter((k) => result.contents[k as AgentFormat]).length))} ${chalk.bold('output formats.')}`,
    );
    console.log('');
    console.log(
      chalk.dim(
        '  💡 Tip: add custom rules below the <!-- Custom rules below this line ... --> marker.',
      ),
    );
    console.log(chalk.dim('  ⭐ Star us: https://github.com/BahaaEldin0/aiprep'));
    console.log('');
  });

program
  .command('list')
  .description('List all available presets.')
  .action(() => {
    process.stdout.write(banner());
    const presets = getAllPresets();
    const byType: Record<string, typeof presets> = { meta: [], framework: [], tool: [] };
    for (const p of presets) byType[p.type]?.push(p);

    const sections: [string, string][] = [
      ['meta', 'Meta'],
      ['framework', 'Frameworks'],
      ['tool', 'Tools'],
    ];

    for (const [key, label] of sections) {
      const list = byType[key] ?? [];
      console.log(chalk.bold.cyan(`\n${label} (${list.length})`));
      for (const p of list) {
        const ruleCount = p.rules.length + (p.conditionalRules?.length ?? 0);
        console.log(
          `  ${chalk.green(p.id.padEnd(24))} ${chalk.dim(String(ruleCount).padStart(3))} rules  ${p.description}`,
        );
      }
    }
    console.log(chalk.bold(`\nTotal: ${presets.length} presets.\n`));
  });

program
  .command('check')
  .description('Show which agent config files exist in the current project.')
  .option('--cwd <dir>', 'project directory (default: current directory)')
  .action((opts) => {
    process.stdout.write(banner());
    const cwd = resolve(opts.cwd ?? process.cwd());
    console.log(chalk.bold('AI agent config files:'));
    for (const [agent, path] of Object.entries(AGENT_FILE_PATHS)) {
      const exists = existsSync(resolve(cwd, path));
      const mark = exists ? chalk.green('✓') : chalk.dim('·');
      const label = chalk.dim(`(${AGENT_LABELS[agent as AgentFormat]})`);
      console.log(`  ${mark} ${path.padEnd(40)} ${label}`);
    }
    console.log('');
  });

program.parseAsync().catch((err: unknown) => {
  console.error(chalk.red(err instanceof Error ? err.message : String(err)));
  process.exit(1);
});
