# Build `aiprep` — Full Project Instructions for Claude Code

## What You're Building

A CLI tool called `aiprep` that developers run with `npx aiprep` in any project. It auto-detects their tech stack from config files (package.json, pyproject.toml, go.mod, etc.), then generates high-quality AI coding agent configuration files (CLAUDE.md, .cursor/rules/, AGENTS.md, .github/copilot-instructions.md, .windsurfrules, GEMINI.md) using curated, hand-written rule presets per framework/tool.

**This is NOT an AI-powered tool.** It does not call any LLM APIs. It's a pure code-generation CLI that runs in milliseconds, offline, with zero config.

Think of it as "eslint --init" but for AI coding rules. It doesn't analyze your code style — it applies expert-curated rule presets based on your detected stack.

---

## Phase 1: Project Scaffolding

Initialize the project in a new directory called `aiprep`.

### Tech Stack
- **Language:** TypeScript (strict mode)
- **Build:** tsup (bundle to ESM + CJS)
- **CLI framework:** Commander.js
- **Terminal UI:** chalk (colors), ora (spinners), boxen (boxes)
- **Testing:** Vitest
- **Package manager:** pnpm
- **Node target:** >=18
- **License:** MIT

### package.json

```json
{
  "name": "aiprep",
  "version": "0.1.0",
  "description": "Detect your stack, generate battle-tested AI coding rules for every agent in 5 seconds.",
  "keywords": ["ai", "claude", "cursor", "copilot", "codex", "windsurf", "gemini", "coding-rules", "agents", "CLAUDE.md", "cursorrules", "AGENTS.md", "developer-tools", "cli"],
  "bin": {
    "aiprep": "./dist/cli.js"
  },
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "tsc --noEmit",
    "prepublishOnly": "pnpm build"
  },
  "engines": {
    "node": ">=18"
  },
  "license": "MIT"
}
```

### tsup.config.ts
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts', 'src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node'
  }
});
```

Note: Only add the shebang banner to cli.ts entry, not index.ts. Handle this properly.

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

## Phase 2: Core Architecture

### Directory Structure
```
aiprep/
├── src/
│   ├── cli.ts                         # CLI entry point (Commander)
│   ├── index.ts                       # Programmatic API export
│   ├── core/
│   │   ├── detect.ts                  # Stack detection orchestrator
│   │   ├── compose.ts                 # Preset composition engine
│   │   ├── generate.ts                # Output file generator
│   │   └── types.ts                   # All TypeScript types/interfaces
│   ├── detectors/
│   │   ├── node.ts                    # package.json detector
│   │   ├── python.ts                  # pyproject.toml / requirements.txt
│   │   ├── go.ts                      # go.mod
│   │   ├── rust.ts                    # Cargo.toml
│   │   └── generic.ts                 # .git, Dockerfile, docker-compose, Makefile
│   ├── presets/
│   │   ├── index.ts                   # Preset registry
│   │   ├── frameworks/
│   │   │   ├── nextjs-approuter.ts
│   │   │   ├── nextjs-pages.ts
│   │   │   ├── react-vite.ts
│   │   │   ├── vue-nuxt.ts
│   │   │   ├── svelte-sveltekit.ts
│   │   │   ├── express.ts
│   │   │   ├── fastify.ts
│   │   │   ├── nestjs.ts
│   │   │   ├── django.ts
│   │   │   ├── fastapi.ts
│   │   │   ├── flask.ts
│   │   │   ├── go-stdlib.ts
│   │   │   └── rust-axum.ts
│   │   ├── tools/
│   │   │   ├── typescript.ts
│   │   │   ├── tailwind.ts
│   │   │   ├── prisma.ts
│   │   │   ├── drizzle.ts
│   │   │   ├── vitest.ts
│   │   │   ├── jest.ts
│   │   │   ├── pytest.ts
│   │   │   ├── docker.ts
│   │   │   └── monorepo-turborepo.ts
│   │   └── meta/
│   │       ├── base.ts                # Universal good-practice rules
│   │       └── strict.ts              # Extra-strict rules
│   ├── formatters/
│   │   ├── index.ts                   # Formatter registry
│   │   ├── claude.ts                  # → CLAUDE.md
│   │   ├── cursor.ts                  # → .cursor/rules/aiprep.mdc
│   │   ├── agents.ts                  # → AGENTS.md
│   │   ├── copilot.ts                 # → .github/copilot-instructions.md
│   │   ├── windsurf.ts               # → .windsurfrules
│   │   └── gemini.ts                  # → GEMINI.md
│   └── context/
│       ├── structure.ts               # Directory tree snapshot
│       └── scripts.ts                 # Extract npm scripts / build commands
├── tests/
│   ├── detect.test.ts
│   ├── compose.test.ts
│   ├── formatters.test.ts
│   └── fixtures/                      # Fake project dirs for testing
│       ├── nextjs-app/
│       │   └── package.json
│       ├── express-api/
│       │   └── package.json
│       └── python-fastapi/
│           └── pyproject.toml
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── .gitignore
├── LICENSE
└── README.md
```

---

## Phase 3: Types (src/core/types.ts)

```typescript
export interface DetectedStack {
  /** e.g., "node", "python", "go", "rust" */
  runtime: string;
  /** e.g., "pnpm", "npm", "yarn", "bun", "pip", "poetry" */
  packageManager?: string;
  /** Detected frameworks with version hints */
  frameworks: DetectedItem[];
  /** Detected tools/libraries */
  tools: DetectedItem[];
  /** Raw project info */
  project: ProjectInfo;
}

export interface DetectedItem {
  /** Preset ID, e.g., "nextjs-approuter", "prisma", "tailwind" */
  id: string;
  /** Human-readable name */
  name: string;
  /** Detected version if available */
  version?: string;
  /** Confidence: 1 = certain, 0.5 = likely */
  confidence: number;
}

export interface ProjectInfo {
  /** Project name from package.json or directory */
  name: string;
  /** Detected directory structure (top 2 levels) */
  structure: string[];
  /** Build/dev/test/lint scripts */
  scripts: Record<string, string>;
  /** Key file paths found */
  keyFiles: string[];
}

export interface Preset {
  /** Unique ID matching DetectedItem.id */
  id: string;
  /** Human-readable name */
  name: string;
  /** What this preset covers */
  description: string;
  /** The actual rules - each rule is a clear, actionable instruction */
  rules: Rule[];
  /** Optional: rules that only apply when combined with another preset */
  conditionalRules?: ConditionalRule[];
}

export interface Rule {
  /** Rule content — a clear, specific instruction for the AI agent */
  content: string;
  /** Category for grouping: "architecture", "conventions", "patterns", "errors", "testing", "security" */
  category: RuleCategory;
}

export type RuleCategory = 'architecture' | 'conventions' | 'patterns' | 'errors' | 'testing' | 'security' | 'performance' | 'imports';

export interface ConditionalRule extends Rule {
  /** Only include this rule when the given preset is also active */
  when: string;
}

export type AgentFormat = 'claude' | 'cursor' | 'agents' | 'copilot' | 'windsurf' | 'gemini';

export interface GenerateOptions {
  /** Which agent formats to output. Default: all */
  agents?: AgentFormat[];
  /** Override detected presets */
  presets?: string[];
  /** Project root directory */
  cwd?: string;
  /** Don't write files, just return content */
  dryRun?: boolean;
  /** Overwrite existing files without asking */
  force?: boolean;
}

export interface GenerateResult {
  /** Detected stack info */
  stack: DetectedStack;
  /** Applied preset IDs */
  appliedPresets: string[];
  /** Files that were written */
  writtenFiles: WrittenFile[];
  /** Files that were skipped (already exist, no --force) */
  skippedFiles: string[];
}

export interface WrittenFile {
  path: string;
  agent: AgentFormat;
  size: number;
}
```

---

## Phase 4: Stack Detection (src/detectors/)

### node.ts — The most important detector

Read `package.json` and detect:

1. **Package manager**: Check for `pnpm-lock.yaml` → pnpm, `yarn.lock` → yarn, `bun.lockb` → bun, else npm
2. **Frameworks** (check `dependencies` + `devDependencies`):
   - `next` → then check for `app/` directory → "nextjs-approuter" or "nextjs-pages"
   - `react` (without next) + `vite` → "react-vite"
   - `vue` or `nuxt` → "vue-nuxt"
   - `svelte` or `@sveltejs/kit` → "svelte-sveltekit"
   - `express` → "express"
   - `fastify` → "fastify"
   - `@nestjs/core` → "nestjs"
3. **Tools** (check deps + devDeps):
   - `typescript` → "typescript"
   - `tailwindcss` → "tailwind"
   - `prisma` or `@prisma/client` → "prisma"
   - `drizzle-orm` → "drizzle"
   - `vitest` → "vitest"
   - `jest` → "jest"
4. **Scripts**: Extract all scripts from package.json

### python.ts

Read `pyproject.toml` (use basic string parsing, no toml library needed) or `requirements.txt`:
- `django` → "django"
- `fastapi` → "fastapi"
- `flask` → "flask"
- `pytest` → "pytest"

### go.ts

Read `go.mod`:
- Check for common frameworks in `require` block

### rust.ts

Read `Cargo.toml`:
- `axum` → "rust-axum"

### generic.ts

Check for files in project root:
- `Dockerfile` or `docker-compose.yml` → "docker"
- `turbo.json` → "monorepo-turborepo"
- `.git` → note git usage

---

## Phase 5: Presets (THE MOST IMPORTANT PART)

Each preset file exports a `Preset` object. The rules must be **specific, actionable, and genuinely useful** — not generic advice. Every rule should be something that, if the AI follows it, produces better code for that specific framework.

### src/presets/meta/base.ts — Applied to ALL projects

```typescript
export const basePreset: Preset = {
  id: 'base',
  name: 'Base Rules',
  description: 'Universal best practices for AI-assisted coding',
  rules: [
    {
      content: 'Always produce complete, working code. Never use placeholder comments like "// rest of the code here" or "// implement this". Every function must be fully implemented.',
      category: 'conventions'
    },
    {
      content: 'When editing existing files, preserve the existing code style (indentation, quotes, semicolons, trailing commas) even if you would choose differently in a new file.',
      category: 'conventions'
    },
    {
      content: 'When you create a new file, include all necessary imports at the top. Never assume an import exists without verifying.',
      category: 'imports'
    },
    {
      content: 'Before suggesting a dependency, check if it is already in the project. Do not introduce duplicate functionality.',
      category: 'conventions'
    },
    {
      content: 'Write error messages that help debugging: include the operation that failed, the input that caused it, and a suggestion for fixing it.',
      category: 'errors'
    },
    {
      content: 'Never commit secrets, API keys, or credentials. Use environment variables and reference them from a .env file that is in .gitignore.',
      category: 'security'
    },
    {
      content: 'When making changes, explain what you changed and why in a brief summary. Do not re-explain the entire file.',
      category: 'conventions'
    },
    {
      content: 'Prefer early returns over deeply nested if/else blocks. Guard clauses at the top of functions.',
      category: 'patterns'
    }
  ]
};
```

### src/presets/frameworks/nextjs-approuter.ts

Write a complete preset with 25-30 rules covering:

**Architecture rules:**
- Use Server Components by default. Only add `'use client'` when you need interactivity, browser APIs, event handlers, or React hooks (useState, useEffect, etc.)
- Use the App Router file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Colocate related files in route segments. Keep components used by a single route in that route's directory
- Use Route Groups `(groupName)` to organize routes without affecting the URL structure
- Data fetching belongs in Server Components using `async/await`, not in Client Components with `useEffect`

**Conventions rules:**
- Use the Metadata API (`export const metadata` or `generateMetadata`) for SEO. Never use a `<Head>` component
- Use `next/image` for all images. Set explicit `width` and `height` or use `fill` with a sized parent
- Use `next/link` for all internal navigation. Never use `<a>` tags for internal routes
- Use `next/font` for fonts. Load in root layout and pass via CSS variable
- Import from `next/navigation` (App Router), never from `next/router` (Pages Router)

**Patterns rules:**
- Prefer Server Actions (`'use server'`) for form submissions and data mutations over API route handlers
- For data revalidation, use `revalidatePath()` or `revalidateTag()` after mutations
- Use `generateStaticParams` (not `getStaticPaths`) for static generation of dynamic routes
- Implement Parallel Routes (`@slot`) and Intercepting Routes (`(.)`, `(..)`) for complex layouts
- Use `Suspense` boundaries with `loading.tsx` for streaming. Wrap slow data fetches in their own Suspense boundary
- For authentication, check in middleware.ts for route protection. Use `cookies()` or `headers()` in Server Components for user context

**Error rules:**
- Every route segment should have an `error.tsx` boundary. Use `'use client'` since error boundaries must be Client Components
- Global errors go in `app/global-error.tsx`. This replaces the root layout during errors
- API route handlers must return proper `NextResponse` with status codes. Always handle errors with try/catch

**Conditional rules (when combined with other presets):**
- When "prisma" is active: Run Prisma queries directly in Server Components and Server Actions. Never expose Prisma client to the browser
- When "tailwind" is active: Use Tailwind classes directly on elements. Use `cn()` utility (from `clsx` + `tailwind-merge`) for conditional classes

### src/presets/frameworks/express.ts

Write a complete preset with 20-25 rules covering:
- Middleware ordering: helmet → cors → compression → body-parser → routes → error handler
- Async error handling: wrap all async route handlers or use express-async-errors
- Input validation at the route level before any business logic
- Centralized error handling middleware as the last `app.use()` with `(err, req, res, next)` signature
- Use Router instances (`express.Router()`) for modular route files
- Environment-based configuration (no hardcoded values)
- Logging with structured logger (pino/winston), not console.log
- Security: use `helmet()`, rate limiting, CORS configuration, input sanitization
- Always set explicit response status codes and use consistent response shapes: `{ success, data, error }`
- Graceful shutdown handling: listen for SIGTERM/SIGINT and close server + DB connections

### src/presets/frameworks/react-vite.ts

20-25 rules covering:
- Functional components only, with explicit TypeScript prop interfaces
- Custom hooks for all reusable stateful logic. Name them `use[Purpose]`
- State management: local state → context → external store (zustand/jotai). Don't jump to Redux
- Memoization: only `useMemo`/`useCallback` when you have measured performance issues or passing to memoized children. Don't premature-optimize
- File structure: feature-based, not type-based. Group by domain (`features/auth/`, `features/dashboard/`), not by kind (`components/`, `hooks/`, `utils/`)
- Event handlers named `handle[Event]`, callback props named `on[Event]`
- Use `ErrorBoundary` components to catch render errors. Each major feature should have one
- Forms: controlled components with proper validation. Use react-hook-form for complex forms
- Keys in lists: use stable unique IDs, never array indices (unless the list is static and never reordered)

### src/presets/frameworks/fastify.ts

20 rules covering Fastify-specific patterns:
- Use JSON Schema for route validation (querystring, params, body, headers)
- Register plugins with `fastify-plugin` for encapsulation
- Use decorators for shared utilities: `fastify.decorate('db', dbInstance)`
- Async handler functions — Fastify handles promise rejections automatically, no need for try/catch for 500s
- Use `setErrorHandler` for centralized error handling per plugin scope
- Typed routes using `RouteGenericInterface` for full type safety
- Logging: use Fastify's built-in pino logger, don't add another logger

### src/presets/frameworks/nestjs.ts

20 rules for NestJS patterns.

### src/presets/frameworks/django.ts

20 rules for Django patterns:
- Fat models, thin views
- Use class-based views for CRUD, function-based for custom logic
- Always use Django's ORM queryset methods — never raw SQL unless absolutely necessary
- Use `select_related()` and `prefetch_related()` to prevent N+1 queries
- Settings split: base.py, development.py, production.py
- Use Django REST Framework serializers for all API input/output
- Custom user model from day 1 (`AbstractUser`)
- Migrations: one migration per logical change, never edit a pushed migration

### src/presets/frameworks/fastapi.ts

20 rules for FastAPI patterns:
- Use Pydantic models for all request/response schemas
- Dependency injection via `Depends()` for DB sessions, auth, config
- Use `async def` for I/O-bound endpoints, `def` for CPU-bound
- Background tasks via `BackgroundTasks` parameter
- Use APIRouter for modular route organization
- Proper HTTP status codes with `status.HTTP_xxx` constants
- Exception handlers with `@app.exception_handler`

### src/presets/tools/typescript.ts

15 rules:
- Enable `strict: true` in tsconfig. Never use `any` — use `unknown` and narrow
- Use `interface` for object shapes that may be extended, `type` for unions, intersections, and mapped types
- Prefer `as const` over enums for string literals
- Use discriminated unions for state machines and complex conditional types
- Explicit return types on exported functions. Inferred return types for internal functions are fine
- Use `satisfies` operator for type checking object literals without widening
- Branded types for IDs: `type UserId = string & { readonly __brand: 'UserId' }`

### src/presets/tools/tailwind.ts

12 rules:
- Use utility classes directly on elements. Extract components, not CSS classes
- Use `cn()` utility (clsx + tailwind-merge) for conditional/merged classes
- Design tokens go in `tailwind.config` (theme.extend), not as CSS variables, unless you need runtime theming
- Responsive design: mobile-first (no prefix = mobile, `sm:` = 640px+, `md:` = 768px+)
- Dark mode: use `dark:` variant. Implement with class strategy for user preference
- Avoid `@apply` in CSS files. If you need `@apply`, you probably need a component instead
- Group related utilities: layout (flex/grid) → spacing → sizing → typography → colors → effects

### src/presets/tools/prisma.ts

15 rules:
- Define schema in `prisma/schema.prisma`. Run `npx prisma generate` after every schema change
- Use `@map` and `@@map` to decouple database naming (snake_case) from TypeScript naming (camelCase)
- Always use transactions for multi-step writes: `prisma.$transaction([...])`
- Use `select` or `include` explicitly — never fetch entire records when you only need 2 fields
- Create a singleton PrismaClient: instantiate once, reuse everywhere. In development, attach to `globalThis` to prevent hot-reload connection exhaustion
- Seed data goes in `prisma/seed.ts`, referenced in package.json `prisma.seed`
- Migrations: `prisma migrate dev` locally, `prisma migrate deploy` in CI/CD. Never run `dev` in production
- Use Prisma middleware or `$extends` for cross-cutting concerns (soft delete, audit logs, timing)

### src/presets/tools/drizzle.ts

12 rules for Drizzle ORM.

### src/presets/tools/vitest.ts

12 rules:
- Test files colocated with source: `feature.ts` → `feature.test.ts` in the same directory
- Use `describe` blocks for grouping by function/feature, `it` for individual behaviors
- Test names read as sentences: `it('returns empty array when no items match filter')`
- One assertion concept per test. Multiple `expect()` calls are fine if testing the same concept
- Use `vi.mock()` at the top level for module mocking. Use `vi.fn()` for individual function mocks
- Prefer `toEqual` for deep equality, `toBe` for primitives and referential equality
- Use `beforeEach` for setup that every test needs. Avoid `beforeAll` unless truly expensive (DB connection)
- Test behavior, not implementation. Don't test that a function calls another function — test the output

### src/presets/tools/jest.ts, src/presets/tools/pytest.ts, src/presets/tools/docker.ts, src/presets/tools/monorepo-turborepo.ts

Write 10-15 rules each following the same quality standard.

### src/presets/meta/strict.ts

Extra rules for teams that want maximum strictness:
- No `console.log` in production code. Use a structured logger
- Every exported function must have a JSDoc comment explaining purpose, params, and return
- No magic numbers. Extract to named constants
- No default exports (named exports only for better refactoring)
- Maximum function length: 30 lines. If longer, extract helper functions
- Maximum file length: 300 lines. If longer, split into modules
- No nested ternaries. Use early returns or if/else
- All async functions must have error handling or explicitly propagate

### Preset Registry (src/presets/index.ts)

Export a Map of all presets keyed by ID. Export a function `getPresetsByIds(ids: string[]): Preset[]` that returns presets in dependency order (base first, then frameworks, then tools, then meta).

---

## Phase 6: Preset Composition (src/core/compose.ts)

Takes a `DetectedStack` and produces a flat list of `Rule[]`:

1. Always start with `base` preset
2. Add framework presets (from detection)
3. Add tool presets (from detection)
4. Process `conditionalRules` — include them only if their `when` preset is also active
5. Deduplicate rules with similar content
6. Return composed rules grouped by category

---

## Phase 7: Formatters (src/formatters/)

Each formatter takes composed rules + ProjectInfo and outputs a string in the agent's expected format.

### claude.ts → CLAUDE.md

```markdown
# CLAUDE.md

> Generated by [aiprep](https://github.com/TODO/aiprep) — do not edit the generated sections.
> To regenerate: `npx aiprep`

## Project Overview

- **Name:** {project.name}
- **Stack:** {detected stack summary}
- **Package Manager:** {packageManager}

## Build & Development Commands

{scripts formatted as a list}

## Coding Rules

### Architecture
{rules in architecture category}

### Conventions
{rules in conventions category}

### Patterns
{rules in patterns category}

... (all categories)

## Project Structure

```
{directory tree, top 2 levels}
```

## Key Files

{list of key files like config files, entry points}

<!-- Custom rules below this line will be preserved on regeneration -->
```

**IMPORTANT:** The formatter must detect an existing CLAUDE.md file and preserve any content below a `<!-- Custom rules below this line will be preserved on regeneration -->` marker. This way users can add their own rules that don't get overwritten.

### cursor.ts → .cursor/rules/aiprep.mdc

Cursor rules use the `.mdc` format (markdown with YAML frontmatter). Generate a SINGLE file at `.cursor/rules/aiprep.mdc`:

```markdown
---
description: AI coding rules generated by aiprep for {stack summary}
globs:
alwaysApply: true
---

{all rules as a flat markdown list, grouped by category with ## headers}
```

### agents.ts → AGENTS.md

Standard markdown. Format similar to CLAUDE.md but following the AGENTS.md convention (more concise, no project structure section, just rules).

### copilot.ts → .github/copilot-instructions.md

Similar to AGENTS.md. Copilot reads this from `.github/copilot-instructions.md`.

### windsurf.ts → .windsurfrules

Similar format to .cursorrules. Plain markdown with rules.

### gemini.ts → GEMINI.md

Same structure as CLAUDE.md, adapted for Gemini CLI conventions.

---

## Phase 8: Context Extraction (src/context/)

### structure.ts

Walk the project directory (top 2 levels only, skip node_modules, .git, dist, build, __pycache__, .next, .nuxt, .svelte-kit, venv, .venv). Return an array of relative paths formatted as a tree string.

### scripts.ts

Extract scripts from package.json. For Python, check for Makefile targets or pyproject.toml scripts. Return as Record<string, string>.

---

## Phase 9: CLI (src/cli.ts)

Beautiful CLI experience with Commander:

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
// ... etc

const program = new Command();

program
  .name('aiprep')
  .description('Detect your stack, generate AI coding rules for every agent in 5 seconds')
  .version('0.1.0');

program
  .command('init', { isDefault: true })
  .description('Auto-detect stack and generate AI agent config files')
  .option('--presets <presets>', 'Comma-separated preset IDs to apply (overrides auto-detection)')
  .option('--agents <agents>', 'Comma-separated agent formats to output (default: all)')
  .option('--force', 'Overwrite existing files without prompting')
  .option('--dry-run', 'Preview what would be generated without writing files')
  .option('--cwd <dir>', 'Project directory (default: current directory)')
  .action(async (options) => {
    // 1. Show banner
    // 2. Spin: "Detecting your stack..."
    // 3. Show detected stack with checkmarks
    // 4. Spin: "Generating rules..."
    // 5. Show generated files with checkmarks
    // 6. Show footer with star prompt
  });

program
  .command('list')
  .description('List all available presets')
  .action(() => {
    // Show all presets in a formatted table
  });

program
  .command('check')
  .description('Validate existing AI config files')
  .action(async () => {
    // Check if CLAUDE.md, AGENTS.md etc. exist and are from aiprep
  });

program.parse();
```

### CLI Output Design

The CLI should output something like this (use chalk colors):

```
  ╭─────────────────────────────────────╮
  │                                     │
  │   ⚡ aiprep v0.1.0                  │
  │   AI agent rules, zero effort       │
  │                                     │
  ╰─────────────────────────────────────╯

  Detecting stack...

  Detected:
    ✓ Next.js 15         (App Router)
    ✓ TypeScript 5.6
    ✓ Tailwind CSS 4.0
    ✓ Prisma 6.2
    ✓ Vitest 3.1
    ✓ pnpm

  Applying presets: base, nextjs-approuter, typescript, tailwind, prisma, vitest

  Generated:
    ✓ CLAUDE.md                             (Claude Code)
    ✓ .cursor/rules/aiprep.mdc             (Cursor)
    ✓ AGENTS.md                            (Codex / Universal)
    ✓ .github/copilot-instructions.md      (GitHub Copilot)
    ✓ .windsurfrules                       (Windsurf)
    ✓ GEMINI.md                            (Gemini CLI)

  Applied 47 rules from 6 presets.

  💡 Tip: Add custom rules below the marker line in each file.
  ⭐ Love it? Star us: https://github.com/TODO/aiprep
```

Use green checkmarks, cyan for names, dim for parenthetical notes. Box at the top using `boxen`. Spinners with `ora` during detection and generation.

---

## Phase 10: Tests

Write tests for:

1. **Detection tests** — Given fixture package.json files, verify correct framework/tool detection
2. **Composition tests** — Given preset IDs, verify correct rule composition and conditional rule handling
3. **Formatter tests** — Verify output format correctness for each agent format
4. **CLI integration test** — Run the CLI against a fixture project directory and verify file output

Create fixture directories in `tests/fixtures/` with minimal package.json files for different stacks:
- `nextjs-app/package.json` — Next.js 15 with app directory
- `express-api/package.json` — Express with TypeScript
- `python-fastapi/pyproject.toml` — FastAPI project

---

## Phase 11: README.md

Write a compelling README with this structure:

1. **Title + badges** — npm version, downloads, license, stars
2. **One-line description** — "Detect your stack, generate battle-tested AI coding rules for every agent in 5 seconds."
3. **Terminal screenshot / GIF placeholder** — (we'll record this separately)
4. **Quick start** — `npx aiprep` (literally one line)
5. **What it detects** — Table of supported frameworks and tools with checkmarks
6. **What it generates** — Table of supported agent formats
7. **Why aiprep?** — Brief problem statement (3-4 sentences about config fragmentation)
8. **Comparison table** — aiprep vs agent-dotfiles vs caliber-ai vs manual
9. **Presets** — List of all presets with descriptions
10. **Customization** — How to add custom rules below the marker
11. **CLI reference** — Commands and options
12. **Contributing** — How to add a preset (it's just one TypeScript file!)
13. **License** — MIT

Make the README concise but compelling. The goal is to convert a GitHub visitor into a star in under 30 seconds. The GIF and quick start must be above the fold.

---

## Phase 12: Finishing Touches

1. **`.gitignore`** — node_modules, dist, .env, *.tgz
2. **`LICENSE`** — MIT license with current year
3. **`CONTRIBUTING.md`** — How to add a preset (copy a template, fill in rules, submit PR)
4. **`.github/ISSUE_TEMPLATE/`** — Bug report and preset request templates
5. **`vitest.config.ts`** — Basic vitest config

---

## Quality Checklist Before Done

- [ ] `pnpm install` succeeds
- [ ] `pnpm build` produces working dist/
- [ ] `pnpm test` passes all tests
- [ ] `node dist/cli.js` runs and shows help
- [ ] Running in a Next.js project correctly detects the stack
- [ ] Running in an Express project correctly detects the stack
- [ ] All 6 output formats generate valid content
- [ ] Custom rules below marker are preserved on re-run
- [ ] `--dry-run` works
- [ ] `--presets` override works
- [ ] `--agents` filter works
- [ ] README is complete and compelling
- [ ] No TypeScript errors (`pnpm lint`)

---

## IMPORTANT INSTRUCTIONS

1. Write ALL code completely. Every preset file must have real, substantive rules — not placeholder TODOs. The presets ARE the product.
2. Every preset must have at least 10 rules minimum. The top presets (Next.js, TypeScript, Express) should have 20-30.
3. Rules must be SPECIFIC and ACTIONABLE. Not "write clean code" but "Use Server Components by default. Only add 'use client' when you need interactivity, browser APIs, or React hooks."
4. Test everything compiles and runs.
5. The CLI must look beautiful in the terminal. Put effort into the output formatting.