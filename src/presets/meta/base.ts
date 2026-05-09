import type { Preset } from '../../core/types.js';

export const basePreset: Preset = {
  id: 'base',
  name: 'Base Rules',
  description: 'Universal rules every aiprep-generated config inherits.',
  type: 'meta',
  rules: [
    {
      content:
        'Produce complete, runnable code. Never use placeholders like `// TODO`, `// rest of the code here`, `// implement this`, or `...`. Every function body must be fully written; if you genuinely cannot finish, say so explicitly in the response — do not leave a stub.',
      category: 'conventions',
    },
    {
      content:
        'When editing an existing file, match the file\'s existing style exactly: indentation (tabs vs spaces and width), quote style (single vs double), trailing commas, semicolons, and import order. Do not reformat unrelated lines — diffs must contain only intentional changes.',
      category: 'conventions',
    },
    {
      content:
        'When you create a new file, write all required imports at the top. Verify each import path resolves (relative paths start with `./` or `../`, package imports must exist in the project\'s manifest). Never invent module paths or symbol names.',
      category: 'imports',
    },
    {
      content:
        'Before adding a dependency, search the project\'s package manifest (package.json, pyproject.toml, go.mod, Cargo.toml, composer.json, Gemfile, pom.xml/build.gradle) for an existing one that solves the problem. Do not introduce a second library that duplicates capability already present (e.g., do not add axios if fetch wrappers already exist; do not add lodash for a single utility).',
      category: 'conventions',
    },
    {
      content:
        'Error messages must include three things: (1) what operation failed, (2) the offending input or state, (3) an actionable next step for the caller. Bad: `throw new Error("invalid")`. Good: `throw new Error(\\`parseConfig: expected number for "port", got ${typeof value} (${value}). Set PORT to an integer.\\`)`.',
      category: 'errors',
    },
    {
      content:
        'Never write secrets, API keys, tokens, passwords, or connection strings into source files. Read them from environment variables. Provide a `.env.example` with placeholder keys committed; the real `.env` must be in `.gitignore`. If you spot a secret in a diff, stop and surface it.',
      category: 'security',
    },
    {
      content:
        'When summarizing a change, name the file paths edited and describe the behavior change in one sentence each. Do not paste back the entire file or repeat code blocks the user can already see in the diff.',
      category: 'conventions',
    },
    {
      content:
        'Prefer guard clauses with early `return`/`throw` over deeply nested `if/else`. Beyond two levels of conditional nesting, extract a helper or invert the predicate. Cyclomatic complexity past ~10 inside one function indicates the function should split.',
      category: 'patterns',
    },
    {
      content:
        'Validate untrusted input at every system boundary: HTTP handlers, message queue consumers, file/stdin reads, IPC, and CLI args. Internal function-to-function calls within the same trust boundary do not need re-validation; trust the type system.',
      category: 'security',
    },
    {
      content:
        'Choose names that make the code self-documenting: function names use a verb (`computeTotal`, `parseConfig`), boolean variables read as predicates (`isValid`, `hasPermission`, `shouldRetry`). Single-letter names are only acceptable for short loop indices and well-known math conventions.',
      category: 'conventions',
    },
  ],
};
