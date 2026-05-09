import type { Preset } from '../../core/types.js';

export const strictPreset: Preset = {
  id: 'strict',
  name: 'Strict Rules',
  description: 'Extra-strict guardrails for teams that want maximum rigor.',
  type: 'meta',
  rules: [
    {
      content:
        'No `console.log` / `print` / `fmt.Println` in committed code paths. Use a structured logger (pino, winston, slog, logging, log/slog, log4j) with explicit levels and key-value context. Temporary debug prints must be removed before commit.',
      category: 'errors',
    },
    {
      content:
        'Every exported (public) function, class, and type must have a doc comment that names: what it does, parameters, return value, and any thrown errors. Internal/private symbols do not need this.',
      category: 'conventions',
    },
    {
      content:
        'No magic numbers in business logic. Numeric constants get a named identifier at the top of the file or in a constants module. Exceptions: 0, 1, -1, and array indices are fine.',
      category: 'conventions',
    },
    {
      content:
        'Use named exports only. No default exports. Default exports defeat refactoring tools (rename across files, find references) and cause inconsistent import names at call sites.',
      category: 'imports',
    },
    {
      content:
        'Functions stay under ~30 lines of body. If a function grows past 30 lines, extract a private helper. Long functions hide untested branches and resist code review.',
      category: 'patterns',
    },
    {
      content:
        'Files stay under ~300 lines. If a file passes 300 lines, split by domain concept (one module = one cohesive responsibility), not by file type.',
      category: 'architecture',
    },
    {
      content:
        'No nested ternaries (`a ? b : c ? d : e`). Use `if`/`else` blocks or extract to a helper that returns. A nested ternary is unreadable in code review and a known source of bugs.',
      category: 'patterns',
    },
    {
      content:
        'Every async function either handles its rejections explicitly or documents that the caller must. Unawaited promises in non-test code are a bug. In Node, surface unhandled rejections via `process.on(\'unhandledRejection\')` and exit non-zero.',
      category: 'errors',
    },
    {
      content:
        'Banned: `any` (TypeScript), `unsafe` blocks introduced casually (Rust), `interface{}`/`any` returns from public APIs (Go), `Object.cast(...)` shortcuts. Use `unknown` plus a narrowing check, or define the precise type. Each escape hatch needs a comment justifying why narrowing is impossible.',
      category: 'conventions',
    },
    {
      content:
        'Dead code is deleted, not commented out. Source control preserves history. Commented-out blocks rot, mislead readers, and make grep noisy. If something must come back, restore it from git.',
      category: 'conventions',
    },
  ],
};
