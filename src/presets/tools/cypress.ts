import type { Preset } from '../../core/types.js';

export const cypressPreset: Preset = {
  id: 'cypress',
  name: 'Cypress',
  description: 'Cypress end-to-end and component testing.',
  type: 'tool',
  rules: [
    {
      content:
        'Cypress commands are NOT promises — they are queued. Do NOT `await cy.get(...)`. The chain auto-waits and retries. Mixing `async/await` with `cy.*` causes commands to run out of order.',
      category: 'patterns',
    },
    {
      content:
        '`cy.intercept(\\\'GET\\\', \\\'/api/users\\\', { fixture: \\\'users.json\\\' })` for network stubbing. The previous `cy.route` (v5 and earlier) is removed. Stub external dependencies — flaky tests almost always involve real network.',
      category: 'testing',
    },
    {
      content:
        'Selectors: `[data-cy=\\\'submit\\\']` is the recommended convention. Resilient to className changes and copy edits. NEVER use auto-generated CSS-in-JS hashes — they regenerate per build.',
      category: 'patterns',
    },
    {
      content:
        '`cy.session(\\\'user-1\\\', () => { cy.login(...) })` caches authentication state across tests in the same spec file. Massive speedup vs logging in per test. Different keys for different users.',
      category: 'performance',
    },
    {
      content:
        '`baseUrl` in `cypress.config.ts`: `cy.visit(\\\'/profile\\\')` resolves against it. Without `baseUrl`, the first `cy.visit` to a relative URL crashes. Set per-environment via env var.',
      category: 'conventions',
    },
    {
      content:
        'Default retry-ability is built into `cy.get`, `cy.contains`, assertions chained off them. NEVER `cy.wait(2000)` to "give the page time" — use `cy.get(...).should(\\\'be.visible\\\')` which retries up to the timeout.',
      category: 'patterns',
    },
    {
      content:
        'Custom commands in `cypress/support/commands.ts`: `Cypress.Commands.add(\\\'login\\\', (email, password) => {...})`. Type with `declare global { namespace Cypress { interface Chainable { login(...): void } } }`.',
      category: 'patterns',
    },
    {
      content:
        'Component testing (Cypress 10+): mount components in real browser. Faster feedback than E2E for component-level tests, slower than jsdom-based tools (Vitest + testing-library). Pick one strategy per project.',
      category: 'architecture',
    },
    {
      content:
        '`cy.task(\\\'name\\\', payload)` runs Node code from the browser-side test. Use for DB seeding, file system, or anything not browser-doable. Define tasks in `setupNodeEvents` in config.',
      category: 'patterns',
    },
    {
      content:
        'Run against production builds in CI — same reason as Playwright. Dev server HMR adds nondeterminism. Use `start-server-and-test` to start the prod server before Cypress runs.',
      category: 'testing',
    },
    {
      content:
        'Screenshots/videos on failure are enabled by default in CI mode. Disable videos for faster runs (`video: false`) once you have stable tests; keep screenshots — they\'re cheap.',
      category: 'performance',
    },
    {
      content:
        'Avoid `cy.wait(\\\'@alias\\\')` chained on `cy.intercept` if you don\'t care about the response — it adds 0-many ms of waiting depending on network. Use `should()` assertions on the resulting UI instead.',
      category: 'patterns',
    },
    {
      content:
        'Parallelization needs Cypress Cloud (paid) or external orchestration (Sorry-Cypress). Without it, tests run sequentially per worker. Plan for this in CI — split spec files, run on multiple machines.',
      category: 'performance',
    },
  ],
};
