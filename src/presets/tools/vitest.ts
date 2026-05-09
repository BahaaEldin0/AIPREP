import type { Preset } from '../../core/types.js';

export const vitestPreset: Preset = {
  id: 'vitest',
  name: 'Vitest',
  description: 'Vitest unit/integration testing built on Vite.',
  type: 'tool',
  rules: [
    {
      content:
        'Colocate test files next to source: `feature.ts` next to `feature.test.ts`. The pattern beats a separate `tests/` tree because moves and renames stay together. Configure `include: [\\\'src/**/*.test.ts\\\']` in vitest.config.',
      category: 'conventions',
    },
    {
      content:
        '`describe(\\\'feature\\\')` for grouping; `it(\\\'returns X when Y\\\')` for behaviors. Test names read as English sentences — when a test fails the message tells you what was expected. Avoid `it(\\\'works\\\')` and similar uninformative names.',
      category: 'conventions',
    },
    {
      content:
        '`vi.mock(\\\'./module\\\')` is HOISTED to the top of the file at compile time. It runs before any imports — including the import of the module being mocked. This is why `vi.mock` calls must NOT reference outer-scope variables (they don\'t exist yet at hoist time).',
      category: 'patterns',
    },
    {
      content:
        'For mocks that need outer values, use `vi.hoisted(() => ({ mockFn: vi.fn() }))`. The factory runs at hoist time and the result is accessible inside `vi.mock`. Without `vi.hoisted` you get "ReferenceError: Cannot access X before initialization."',
      category: 'patterns',
    },
    {
      content:
        '`toEqual` for deep equality (objects, arrays). `toBe` for primitives and reference equality (`Object.is`). `toStrictEqual` is `toEqual` plus structural checks (no extra props, same prototype). Picking wrong = false positives.',
      category: 'patterns',
    },
    {
      content:
        'Reset mocks between tests with `beforeEach(() => vi.resetAllMocks())` or set `clearMocks: true` in config. Without reset, a mock\'s call history bleeds into the next test and produces phantom assertions.',
      category: 'errors',
    },
    {
      content:
        'Fake timers: `vi.useFakeTimers()` then `vi.advanceTimersByTime(ms)` to fast-forward. ALWAYS pair with `vi.useRealTimers()` in `afterEach` — leaked fake timers break tests in other files. With async code, `await vi.advanceTimersByTimeAsync(ms)`.',
      category: 'patterns',
    },
    {
      content:
        'Test BEHAVIOR, not implementation. Assert what the function returns / what side effects appear, not which internal helpers were called. Tests coupled to internals break on refactors that don\'t change behavior.',
      category: 'conventions',
    },
    {
      content:
        'Snapshot tests sparingly. Useful for stable serializations (HTML output, deeply structured config). Useless for anything that changes on every run (timestamps, IDs). Update with `vitest -u` AFTER reviewing the diff.',
      category: 'patterns',
    },
    {
      content:
        '`test.each` for parametrized tests: `test.each([[1, 2, 3], [4, 5, 9]])(\\\'add(%i, %i) = %i\\\', (a, b, expected) => expect(add(a, b)).toBe(expected))`. Replaces hand-rolled loops; per-case names appear in the runner.',
      category: 'patterns',
    },
    {
      content:
        'Coverage with the v8 provider: `coverage: { provider: \\\'v8\\\', reporter: [\\\'text\\\', \\\'html\\\'], thresholds: { lines: 80 } }`. Istanbul provider is slower; v8 is faster and accurate enough. Set thresholds to fail CI on regression.',
      category: 'patterns',
    },
    {
      content:
        'Use `vitest --run` in CI (single pass, exits) and `vitest` in dev (watch mode). Without `--run`, CI hangs forever. Common mistake to copy `pnpm test` script that omits `--run`.',
      category: 'patterns',
    },
    {
      content:
        'For Node-only tests use `environment: \\\'node\\\'` (default). For DOM tests `\\\'jsdom\\\'` or `\\\'happy-dom\\\'` — happy-dom is faster but less complete. Pick per file via `// @vitest-environment jsdom` comment.',
      category: 'patterns',
    },
  ],
};
