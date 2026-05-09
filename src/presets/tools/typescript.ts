import type { Preset } from '../../core/types.js';

export const typescriptPreset: Preset = {
  id: 'typescript',
  name: 'TypeScript',
  description: 'TypeScript 5+ in strict mode with modern type-system features.',
  type: 'tool',
  rules: [
    {
      content:
        'Enable `strict: true` in tsconfig — this turns on `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `alwaysStrict`, `useUnknownInCatchVariables`. Each was introduced because real codebases shipped bugs without it.',
      category: 'conventions',
    },
    {
      content:
        'Add `noUncheckedIndexedAccess: true`. Without it, `array[i]` is typed `T` even though it might be `undefined`. With it, the type is `T | undefined` and you must narrow before use. Catches a class of off-by-one bugs at compile time.',
      category: 'conventions',
    },
    {
      content:
        'NEVER `any`. Every `any` is a runtime crash waiting to happen. Use `unknown` and narrow with type predicates (`x is User`) or `typeof`/`instanceof` checks. If you genuinely need an escape hatch, write `as unknown as Specific` and a comment explaining why.',
      category: 'conventions',
    },
    {
      content:
        'Catch clauses default to `unknown` (with `useUnknownInCatchVariables: true`, on with `strict`). Narrow with `if (err instanceof Error)` before reading `.message`. Don\'t cast immediately — the value might not be an Error (anything can be thrown in JS).',
      category: 'errors',
    },
    {
      content:
        '`interface` for object shapes that may be augmented or implemented (declaration merging works on interfaces, not types). `type` for unions, intersections, mapped types, conditionals, primitives. Pick a default for plain objects — both work, consistency matters.',
      category: 'conventions',
    },
    {
      content:
        'Use `as const` for literal-typed configurations: `const ROLES = [\'admin\', \'user\'] as const` gives `readonly [\'admin\', \'user\']`. With `typeof ROLES[number]` you get the union `\'admin\' | \'user\'`. Beats `enum` for tree-shaking and runtime simplicity.',
      category: 'patterns',
    },
    {
      content:
        '`satisfies` operator preserves narrow inferred types while checking against a wider type. `const config = { theme: \'dark\' } satisfies Config` keeps `config.theme` typed as `\'dark\'`, not the wider `Config[\'theme\']`. Critical for record-style configs.',
      category: 'patterns',
    },
    {
      content:
        'Discriminated unions for state machines: `type State = { status: \'idle\' } | { status: \'loading\' } | { status: \'error\'; err: Error }`. Switch on `status` and TypeScript narrows the union per branch. Hand-rolled boolean flags lose this narrowing.',
      category: 'patterns',
    },
    {
      content:
        'Branded types for IDs: `type UserId = string & { readonly __brand: \'UserId\' }`. Cast at the boundary (DB row, parsed input). Functions accepting `UserId` reject plain strings — eliminates a class of "wrong ID type passed to wrong function" bugs.',
      category: 'patterns',
    },
    {
      content:
        'Explicit return types on EXPORTED functions. Inferred return types are fine for internal functions but exports are part of your public contract — pinning the type prevents accidental contract changes when the body is edited.',
      category: 'conventions',
    },
    {
      content:
        '`readonly` fields and `ReadonlyArray<T>` for immutable data. Mutation attempts become compile errors. Wrap inputs that should not be mutated by your function in `ReadonlyArray<T>`/`readonly T[]` to enforce.',
      category: 'patterns',
    },
    {
      content:
        '`type-only` imports: `import type { User } from \'./types\'`. With `verbatimModuleSyntax: true`, type-only imports are erased entirely from JS output — useful for circular type imports and to keep the bundle small.',
      category: 'imports',
    },
    {
      content:
        'Template literal types model string patterns: `type Route = \\`/users/${string}\\`\\` | \\`/posts/${string}\\``. Combine with `infer` for parsing: extract path params, parse versions. Powerful but easy to over-engineer — use when modeling real string contracts.',
      category: 'patterns',
    },
    {
      content:
        '`infer` keyword inside conditional types extracts type fragments: `type ReturnTypeOf<T> = T extends (...args: any) => infer R ? R : never`. The standard library has `Awaited<T>`, `Parameters<T>`, `ReturnType<T>` — reach for those before rolling your own.',
      category: 'patterns',
    },
    {
      content:
        '`never` for exhaustive checks: `function assertNever(x: never): never { throw new Error(\\`unreachable: ${x}\\`) }`. Place at the end of a switch on a union; if you add a case to the union, this becomes a compile error pointing at the missing case.',
      category: 'patterns',
    },
    {
      content:
        'Module augmentation extends external types: `declare module \'express\' { interface Request { user?: User } }`. Use sparingly — augmentation is global and order-dependent. Prefer wrapping the library API when feasible.',
      category: 'patterns',
    },
  ],
};
