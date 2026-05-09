import type { Preset } from '../../core/types.js';

export const turborepoPreset: Preset = {
  id: 'monorepo-turborepo',
  name: 'Turborepo',
  description: 'Turborepo monorepo with pnpm workspaces and task pipelines.',
  type: 'tool',
  rules: [
    {
      content:
        '`turbo.json` declares the task pipeline: each task lists its `dependsOn` (what must run first) and `outputs` (what to cache). Turbo skips a task entirely if inputs unchanged AND outputs cached.',
      category: 'architecture',
    },
    {
      content:
        '`dependsOn: [\\\"^build\\\"]` (with caret) means "build of upstream packages first." Without the caret, the dep refers to a task on the SAME package. The distinction is critical and easy to miss.',
      category: 'architecture',
    },
    {
      content:
        '`outputs: [\\\"dist/**\\\", \\\".next/**\\\", \\\"!.next/cache/**\\\"]`. Tell turbo what to cache. Missing outputs = no cache hit on subsequent runs. Globs are relative to the package directory.',
      category: 'performance',
    },
    {
      content:
        '`inputs: [\\\"src/**\\\", \\\"package.json\\\"]` narrows what triggers a re-run. Default is "all files in package" — overly broad and causes false invalidations on README edits.',
      category: 'performance',
    },
    {
      content:
        'Use `--filter=<package>` to scope: `turbo build --filter=@app/web`. Filters by package name, dependency graph (`...^web` for deps of web), or path (`./apps/*`). Critical for partial builds.',
      category: 'performance',
    },
    {
      content:
        'Internal packages use `workspace:*` protocol: `\\\"@app/ui\\\": \\\"workspace:*\\\"`. pnpm replaces with the actual workspace path — local symlinks. Publishing replaces with the resolved version.',
      category: 'imports',
    },
    {
      content:
        'Shared TypeScript config: `packages/tsconfig/base.json` extended by each package: `\\\"extends\\\": \\\"@app/tsconfig/base.json\\\"`. Beats per-package config drift. Path aliases (`paths`) defined here propagate.',
      category: 'architecture',
    },
    {
      content:
        'Remote caching with Vercel (free tier) or self-hosted. CI builds populate the cache; local dev hits it. `turbo run build --token=<TOKEN>` in CI. The cache key is content-addressed — no risk of staleness.',
      category: 'performance',
    },
    {
      content:
        'Internal packages exporting source vs built artifacts: pre-built (with `tsup`/`tsc`) is faster but adds a build step. Source-only (with `"main": "src/index.ts"`) is simpler but every consumer pays the compile cost. Pick per package.',
      category: 'architecture',
    },
    {
      content:
        'Do NOT commit `.turbo/`. Add to `.gitignore`. The local cache is per-machine; the remote cache (if enabled) is the shared cache.',
      category: 'conventions',
    },
    {
      content:
        'For dev mode (`turbo dev`), set `cache: false, persistent: true` in the task config. Dev servers are long-running and shouldn\'t be cached — `persistent` tells turbo not to wait for them to exit.',
      category: 'patterns',
    },
    {
      content:
        'Apps live in `apps/`, libraries in `packages/`. App-only deps stay in the app\'s package.json; shared deps (React, types) often live in shared packages. Avoid root-level deps except dev tools.',
      category: 'architecture',
    },
    {
      content:
        'Versioning with Changesets: `pnpm changeset` creates a changelog entry, `pnpm changeset version` bumps versions per the entries, `pnpm changeset publish` publishes to npm. Combined with GitHub Action automation in CI.',
      category: 'patterns',
    },
  ],
};
