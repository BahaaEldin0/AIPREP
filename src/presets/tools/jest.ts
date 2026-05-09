import type { Preset } from '../../core/types.js';

export const jestPreset: Preset = {
  id: 'jest',
  name: 'Jest',
  description: 'Jest test runner with TypeScript and module mocking.',
  type: 'tool',
  rules: [
    {
      content:
        '`jest.mock(\\\'./module\\\')` is hoisted to the top of the file by Babel. Same gotcha as Vitest: factory functions cannot reference outer-scope variables (they don\'t exist at hoist time). Move setup inside the factory or use `jest.doMock` (not hoisted).',
      category: 'patterns',
    },
    {
      content:
        'Reset mocks: `clearMocks: true` (calls/results, not impl), `resetMocks: true` (also resets impl), `restoreMocks: true` (restores spies). Pick the right level — `restoreMocks` for spy-heavy tests; `resetMocks` for pure mock factories.',
      category: 'errors',
    },
    {
      content:
        'Async tests: return the promise OR use async/await. `it(\\\'works\\\', async () => { ... })`. The legacy `done` callback is error-prone — forgotten `done()` hangs the test, doubled `done()` warns.',
      category: 'patterns',
    },
    {
      content:
        '`toMatchObject(partial)` for asserting a subset of properties. `toEqual` requires the exact shape — fails on extra fields. Pick based on whether extras matter.',
      category: 'patterns',
    },
    {
      content:
        '`jest.spyOn(obj, \\\'method\\\')` mocks ONE method while keeping the rest. Returns a mock function — chain `.mockReturnValue(x)` or `.mockImplementation(fn)`. Restore with `spy.mockRestore()` or set `restoreMocks: true`.',
      category: 'patterns',
    },
    {
      content:
        'Manual mocks live in `__mocks__/` adjacent to the module. Jest auto-uses them when you call `jest.mock(\\\'./module\\\')` without a factory. Convention is powerful but invisible — document its use.',
      category: 'patterns',
    },
    {
      content:
        'Fake timers + real promises is a known footgun. `jest.useFakeTimers()` does NOT mock promise microtasks by default. For async code with timers, `await flushPromises()` (rolled-your-own helper) between `jest.advanceTimersByTime` and assertions.',
      category: 'errors',
    },
    {
      content:
        '`--runInBand` for tests sharing state (DB, file system). Default is parallel — fine for pure tests, but two tests writing to the same DB will fail nondeterministically.',
      category: 'patterns',
    },
    {
      content:
        '`moduleNameMapper` for path aliases: `{ \\\'^@/(.*)$\\\': \\\'<rootDir>/src/$1\\\' }`. Mirror tsconfig `paths`. Without it, your imports work in build but fail in tests.',
      category: 'imports',
    },
    {
      content:
        'For TypeScript: ts-jest (full type-check, slower) or `@swc/jest` / Babel + `@babel/preset-typescript` (no type-check, fast). SWC is the modern fast option — type-check separately via `tsc --noEmit`.',
      category: 'performance',
    },
    {
      content:
        '`expect.assertions(n)` at the start of an async test ensures `n` assertions ran. Without it, a thrown rejection silently passes the test (no assertion = no failure). Cheap insurance against false greens.',
      category: 'errors',
    },
    {
      content:
        'Custom matchers via `expect.extend({ toBeValidUser(received) { return { pass: ..., message: () => ... } } })`. Centralizes domain assertions. Prefer over hand-rolled assertions repeated across tests.',
      category: 'patterns',
    },
    {
      content:
        '`setupFilesAfterEach: [\\\'<rootDir>/jest.setup.ts\\\']` runs once per test file AFTER Jest sets up. Common use: extending `expect` with matchers, configuring testing-library. `setupFiles` (no "AfterEach") runs BEFORE Jest sets up — narrower use cases.',
      category: 'patterns',
    },
  ],
};
