import type { Preset } from '../../core/types.js';

export const prettierPreset: Preset = {
  id: 'prettier',
  name: 'Prettier',
  description: 'Prettier code formatter integrated with ESLint and editor.',
  type: 'tool',
  rules: [
    {
      content:
        'Prettier is the SINGLE source of truth for formatting. Disable formatting rules in ESLint via `eslint-config-prettier` (added LAST in the config). Two formatters fighting produces endless commit churn.',
      category: 'conventions',
    },
    {
      content:
        'Commit a `.prettierrc` (JSON or JS) with project conventions: `semi`, `singleQuote`, `trailingComma`, `printWidth`. Use the same defaults across the team — relying on each editor\'s settings means diff noise.',
      category: 'conventions',
    },
    {
      content:
        '`.prettierignore` lists files Prettier should not touch: build outputs (`dist/`, `.next/`), lockfiles, generated code (`*.generated.ts`), and minified assets. Same patterns as `.gitignore` mostly.',
      category: 'conventions',
    },
    {
      content:
        'Run on commit via `husky` + `lint-staged`: `\\\"*.{ts,tsx,js,json,md}\\\": \\\"prettier --write\\\"` in package.json. Catches unformatted code before it lands. Combine with eslint --fix.',
      category: 'patterns',
    },
    {
      content:
        'Editor integration: Prettier on save (VS Code: `editor.formatOnSave: true`, `editor.defaultFormatter: \\\"esbenp.prettier-vscode\\\"`). Without it, contributors keep landing unformatted code despite the lint-staged hook.',
      category: 'patterns',
    },
    {
      content:
        'For Tailwind class ordering install `prettier-plugin-tailwindcss`. Sorts utilities consistently — eliminates code review noise about ordering. Plugin must be listed AFTER other Prettier plugins.',
      category: 'patterns',
    },
    {
      content:
        'Project-wide format check in CI: `prettier --check .`. Fails if anything is unformatted. Prevents "PR that mostly reformats existing code" pollution.',
      category: 'patterns',
    },
    {
      content:
        'Override per file type via `overrides` in `.prettierrc`: `{ files: \\\"*.md\\\", options: { proseWrap: \\\"always\\\", printWidth: 80 } }`. Markdown often wants different wrap behavior than code.',
      category: 'conventions',
    },
  ],
};
