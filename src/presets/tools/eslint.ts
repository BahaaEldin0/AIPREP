import type { Preset } from '../../core/types.js';

export const eslintPreset: Preset = {
  id: 'eslint',
  name: 'ESLint',
  description: 'ESLint flat config with typescript-eslint and import ordering.',
  type: 'tool',
  rules: [
    {
      content:
        'Use the flat config: `eslint.config.js` (NOT `.eslintrc.*`). Legacy `.eslintrc` is deprecated as of ESLint 9. Migrate via `@eslint/migrate-config` or rewrite — flat config is more explicit and faster.',
      category: 'architecture',
    },
    {
      content:
        'Type-aware lint rules from `typescript-eslint` REQUIRE `parserOptions.project: true` (or path to tsconfig). Without it, rules like `no-floating-promises`, `no-misused-promises`, and `no-unsafe-*` are silently skipped — a major source of "lint passes but bug ships."',
      category: 'conventions',
    },
    {
      content:
        'Disable the base `no-unused-vars` rule and use `@typescript-eslint/no-unused-vars` instead — the base rule misreports type imports and TS-specific syntax. Same for `no-undef` (TS handles this).',
      category: 'patterns',
    },
    {
      content:
        'Enable `@typescript-eslint/no-floating-promises`. Catches `myAsyncFn()` (no `await`, no `.catch`) — silently swallowed errors are the most common async bug. Force `void` if you intentionally don\'t await.',
      category: 'errors',
    },
    {
      content:
        'Use `eslint-plugin-import` for `import/order` (group ordering: builtin, external, internal, parent, sibling, index) and `import/no-cycle` (circular dependencies). Add the `import/resolver` for TypeScript path aliases.',
      category: 'imports',
    },
    {
      content:
        'For React: `eslint-plugin-react-hooks` enforces rules of hooks. `react-hooks/exhaustive-deps` is the dependency-array linter — DO NOT disable it project-wide. Disable on individual lines only with a justifying comment.',
      category: 'patterns',
    },
    {
      content:
        'Disable formatting rules — Prettier handles formatting. Add `eslint-config-prettier` LAST in the config to turn off any conflicting style rules. Two formatters fighting is endless.',
      category: 'conventions',
    },
    {
      content:
        'Per-file overrides for tests: `{ files: [\'**/*.test.ts\'], rules: { \\\'@typescript-eslint/no-explicit-any\\\': \\\'off\\\' } }`. Tests sometimes need `any` for mocks; production code does not.',
      category: 'conventions',
    },
    {
      content:
        'Run lint in CI as a separate step from build. `pnpm lint` exits non-zero on failure. Treat warnings as errors via `--max-warnings 0` to prevent warning-creep.',
      category: 'patterns',
    },
    {
      content:
        'Cache lint results: `eslint --cache --cache-location node_modules/.cache/eslint/`. Subsequent runs skip unchanged files — significant on big monorepos. Cache directory should be gitignored (default behavior).',
      category: 'performance',
    },
  ],
};
