# aiprep

[![npm version](https://img.shields.io/npm/v/aiprep.svg)](https://www.npmjs.com/package/aiprep)
[![license](https://img.shields.io/npm/l/aiprep.svg)](LICENSE)
[![node](https://img.shields.io/node/v/aiprep.svg)](https://nodejs.org)

> Detect your stack, generate battle-tested AI coding rules for every agent in 5 seconds.

`aiprep` is a zero-config CLI that scans your project, identifies the frameworks and tools in use, and emits **expert-level coding rules** for every popular AI coding assistant — Claude Code, Cursor, GitHub Copilot, Codex, Windsurf, and Gemini CLI — from a single source of truth. No LLM calls, no configuration, no waiting.

```bash
npx aiprep
```

That's it. One command, six files generated, hundreds of rules applied based on what's actually in your `package.json`.

## Why aiprep?

Every AI coding agent reads its own config file in its own format. Maintaining six versions of "use Server Components by default in Next.js App Router" by hand is busywork that drifts out of sync. `aiprep` fixes that by generating each agent's expected file from a curated rule library written by people who hit the bugs.

The rules are not generic ("write clean code", "handle errors"). They name specific APIs and footguns: *"`@Transactional` self-invocation skips the Spring proxy"*, *"never instantiate `PrismaClient` per request — attach to `globalThis` in dev or HMR exhausts the connection pool"*, *"`KEYS *` blocks Redis; use `SCAN`."*

## What gets generated

| File | Consumer |
|------|----------|
| `CLAUDE.md` | Claude Code |
| `.cursor/rules/aiprep.mdc` | Cursor |
| `AGENTS.md` | Codex, universal AGENTS.md readers |
| `.github/copilot-instructions.md` | GitHub Copilot |
| `.windsurfrules` | Windsurf |
| `GEMINI.md` | Gemini CLI |

`CLAUDE.md` and `GEMINI.md` preserve any content you write below the `<!-- Custom rules below this line will be preserved on regeneration -->` marker — your customizations survive `npx aiprep` runs.

## What gets detected

### Frameworks (20)

Next.js (App Router & Pages), Remix, Astro, Angular, React + Vite, Vue/Nuxt, SvelteKit, Express, Fastify, NestJS, Hono, Django, FastAPI, Flask, Go (stdlib + Gin/Echo/Fiber/Chi), Rust Axum, Laravel, Ruby on Rails, Spring Boot.

### Tools (21)

TypeScript, Tailwind CSS, Prisma, Drizzle ORM, Zod, ESLint, Prettier, Zustand, TanStack Query, tRPC, GraphQL, Supabase, Vitest, Jest, pytest, Playwright, Cypress, Storybook, Docker, Turborepo, Redis.

### Languages

JavaScript/TypeScript (`package.json`), Python (`pyproject.toml`, `requirements.txt`), Go (`go.mod`), Rust (`Cargo.toml`), PHP (`composer.json`), Ruby (`Gemfile`), Java (`pom.xml`, `build.gradle`).

## CLI reference

```bash
aiprep                                          # auto-detect and generate (default = init)
aiprep init                                     # same as above

# Common flags
aiprep init --dry-run                           # preview output, write nothing
aiprep init --agents claude,cursor              # only these formats
aiprep init --presets base,express,typescript   # override detection
aiprep init --force                             # overwrite existing non-preserved files
aiprep init --cwd path/to/project               # operate on a different directory

aiprep list                                     # all 43 presets with rule counts
aiprep check                                    # show which agent files exist
```

## Customization

Edit `CLAUDE.md` (or `GEMINI.md`). Anything below this line is preserved on regeneration:

```markdown
<!-- Custom rules below this line will be preserved on regeneration -->

## My team's rules

- Always lock-and-rebase before pushing
- Use `// FIXME(name): ...` for known-bad code
```

Run `npx aiprep` again — the generated section above the marker is replaced with the latest stack detection, your custom block stays intact.

For total control, pass `--presets`:

```bash
aiprep init --presets base,strict,express,typescript,docker
```

## How the rules are written

Every rule must do at least one of:

1. **Name a specific API/file/config** — *"import from `next/navigation` not `next/router`"*
2. **Call out a real footgun** — *"Server Action throws on missing CSRF; validate input with zod first"*
3. **Encode a measurable threshold** — *"`KEYS *` blocks Redis; for keyspaces > a few hundred keys, use `SCAN`"*
4. **Pin a concrete pattern** — *"wrap multi-step writes in `prisma.$transaction([...])` — partial writes corrupt state"*

Generic advice ("write clean code", "follow best practices") is rejected.

## Programmatic API

```ts
import { detectStack, composeRules, generate } from 'aiprep';

const stack = await detectStack(process.cwd());
const composed = composeRules(stack);

const result = await generate({
  cwd: process.cwd(),
  agents: ['claude', 'cursor'],
  dryRun: true,
});
console.log(result.contents.claude);
```

## Contributing

Adding a preset is a single TypeScript file:

```ts
// src/presets/frameworks/my-framework.ts
import type { Preset } from '../../core/types.js';

export const myFrameworkPreset: Preset = {
  id: 'my-framework',
  name: 'My Framework',
  description: 'One-line description of what it covers.',
  type: 'framework',
  rules: [
    { content: 'Specific rule that names a real API.', category: 'patterns' },
    // ...
  ],
};
```

Register it in `src/presets/index.ts`, add detection in the relevant `src/detectors/*.ts`, write a fixture under `tests/fixtures/`, and submit a PR. See [CONTRIBUTING.md](CONTRIBUTING.md) for the rule quality bar.

## License

MIT — © 2026 BahaaEldin0
