# Contributing to aiprep

Thanks for your interest. Most aiprep contributions are **new presets** for frameworks and tools we don't yet cover, or **better rules** in existing presets.

## Setup

```bash
git clone https://github.com/BahaaEldin0/aiprep
cd aiprep
pnpm install
pnpm dev      # tsup watch mode
pnpm test     # vitest
pnpm lint     # tsc --noEmit
```

Node ≥ 18, pnpm ≥ 9.

## Adding a preset

1. Create `src/presets/frameworks/<id>.ts` (or `tools/<id>.ts`).
2. Export a `Preset` object with `id`, `name`, `description`, `type`, and `rules` (and optional `conditionalRules`).
3. Register it in `src/presets/index.ts`.
4. If aiprep should auto-detect it, add the detection logic in the right detector (`src/detectors/*.ts`).
5. Add or extend a fixture under `tests/fixtures/`.
6. Add a detection test case in `tests/detect.test.ts`.
7. Run `pnpm test` (must pass) and `pnpm lint` (must pass).

Open the PR. CI runs lint + tests on every push.

## Rule quality bar — non-negotiable

Every rule must do at least one of:

1. **Name a specific API/file/config** the AI must use or avoid.
2. **Call out a real footgun** that has bitten a real engineer.
3. **Encode a measurable threshold** (file size, query count, timeout).
4. **Pin a concrete pattern** with the specific symbol/syntax to use.

### Rejected (rewrite or drop)

- "Write clean code"
- "Use proper error handling"
- "Follow best practices"
- "Keep components small"
- Anything that could appear in any framework's preset

### Accepted

- *"Default every component to a Server Component. Add `'use client'` ONLY when the file uses: useState/useReducer/useEffect, event handlers, browser APIs, or context providers that depend on those."*
- *"Express 4 does NOT auto-catch async errors. Either install `express-async-errors` or wrap every async handler."*
- *"`@Transactional` only takes effect on PUBLIC methods called via Spring proxy. Self-invocation (`this.someMethod()`) bypasses the proxy — the transaction never starts."*

## Categories

Pick from the canonical list in `src/core/types.ts`:

- `architecture` — module/file organization, framework lifecycle
- `conventions` — naming, formatting, file structure
- `patterns` — implementation approach, common workflows
- `imports` — what to import from where
- `errors` — error handling, edge cases
- `security` — auth, input validation, secrets
- `performance` — caching, batching, hot paths
- `testing` — test setup and patterns

## Conditional rules

When a rule only applies in combination with another preset, use `conditionalRules`:

```ts
conditionalRules: [
  {
    when: 'prisma',
    content: 'Run Prisma queries in Server Components and Server Actions only — never in Client Components.',
    category: 'architecture',
  },
],
```

The `when` field references another preset's `id`. The rule is included only if that preset is also active.

## Commit conventions

```
<type>(<scope>): <subject>

<body>
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`. Scope is the area (`presets`, `cli`, `detect`, etc.).

Keep subjects under 70 characters. The body explains WHY when it's not obvious.

## License

By contributing you agree that your code is licensed under MIT.
