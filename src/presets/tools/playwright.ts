import type { Preset } from '../../core/types.js';

export const playwrightPreset: Preset = {
  id: 'playwright',
  name: 'Playwright',
  description: 'Playwright cross-browser end-to-end testing.',
  type: 'tool',
  rules: [
    {
      content:
        'Use web-first assertions (`expect(locator).toBeVisible()`, `toHaveText()`). They auto-wait up to the configured timeout for the condition. NEVER pair with `page.waitForTimeout(ms)` — that sleeps unconditionally and is the #1 source of flake.',
      category: 'patterns',
    },
    {
      content:
        'Selectors: `page.getByRole(\\\'button\\\', { name: \\\'Submit\\\' })`, `page.getByLabel(\\\'Email\\\')`, `page.getByTestId(\\\'submit\\\')`. Role/label match the user\'s mental model and accessibility. Avoid `page.locator(\\\'.css-class\\\')` — class names change.',
      category: 'patterns',
    },
    {
      content:
        '`page.locator()` is the modern API; `page.$()` is deprecated. Locators auto-retry; `$` returns a static handle that can become detached. Convert any `$`-style code immediately.',
      category: 'patterns',
    },
    {
      content:
        'Test isolation: each test gets a fresh browser context (cookies, storage, cache). NEVER share state between tests via globals. Use `test.beforeEach` to set up; rely on context isolation for cleanup.',
      category: 'patterns',
    },
    {
      content:
        'Auth setup: `globalSetup` script logs in once and saves storage state to JSON. Tests load via `test.use({ storageState: \\\'auth.json\\\' })` — skips login per test. Slow login multiplied by hundreds of tests adds minutes.',
      category: 'performance',
    },
    {
      content:
        'Custom fixtures via `test.extend({ todoPage: async ({ page }, use) => { const p = new TodoPage(page); await use(p) } })`. Pass to tests by name. Beats hand-rolled `beforeEach` for shared page objects.',
      category: 'patterns',
    },
    {
      content:
        'Parallelism: by default tests in DIFFERENT files run in parallel; tests in the SAME file run serially. Override per file with `test.describe.configure({ mode: \\\'parallel\\\' })`. Worker count via `--workers=N` or `playwright.config`.',
      category: 'performance',
    },
    {
      content:
        'Trace on retry: `use: { trace: \\\'on-first-retry\\\' }`. Generates a `.zip` trace viewable in `npx playwright show-trace trace.zip`. Inspect on flaky tests — has a timeline, network log, console, screenshots.',
      category: 'errors',
    },
    {
      content:
        'Visual regression: `await expect(page).toHaveScreenshot()` snapshots once, compares on subsequent runs. Update with `--update-snapshots`. Use `mask: [page.locator(\\\'.timestamp\\\')]` to hide volatile regions.',
      category: 'testing',
    },
    {
      content:
        'API testing without a browser: `request.newContext()` gives a fetch-like API for HTTP tests. Faster than UI tests for backend-only flows. Combine with browser tests for end-to-end coverage.',
      category: 'testing',
    },
    {
      content:
        'Run against PRODUCTION builds in CI, not dev servers. Dev servers (Next dev, Vite dev) reroute through HMR with non-prod timing — flake. Build first (`next build && next start` or `vite build && vite preview`), then test.',
      category: 'testing',
    },
    {
      content:
        'For CI: install only the browsers you test (`npx playwright install --with-deps chromium`). The default install pulls all three (Chromium, Firefox, WebKit) plus deps — adds minutes to CI cold start.',
      category: 'performance',
    },
    {
      content:
        'Network mocking: `await page.route(\\\'**/api/users\\\', route => route.fulfill({ json: [...] }))`. Stub external dependencies for deterministic tests. Pair with the trace to see what was mocked.',
      category: 'testing',
    },
  ],
};
