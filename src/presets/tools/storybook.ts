import type { Preset } from '../../core/types.js';

export const storybookPreset: Preset = {
  id: 'storybook',
  name: 'Storybook',
  description: 'Storybook component workshop with CSF3 stories and play tests.',
  type: 'tool',
  rules: [
    {
      content:
        'Use Component Story Format 3 (CSF3): `export default { component: Button } as Meta<typeof Button>; export const Primary: StoryObj<typeof Button> = { args: { variant: \\\'primary\\\' } }`. CSF2 (function-based stories) is legacy; CSF3 is more declarative and gives better autodocs.',
      category: 'conventions',
    },
    {
      content:
        '`args` define the controls Storybook generates. `argTypes` customize control shape (`argTypes: { variant: { control: \\\'radio\\\', options: [...] } }`). Without explicit argTypes, Storybook infers — sometimes wrong.',
      category: 'patterns',
    },
    {
      content:
        '`play` function for interaction tests: `play: async ({ canvasElement }) => { const c = within(canvasElement); await userEvent.click(c.getByRole(\\\'button\\\')) }`. Stories become tests — assert in the play function.',
      category: 'testing',
    },
    {
      content:
        'Decorators wrap stories: theme provider, Router, query client. `decorators: [(Story) => <ThemeProvider><Story /></ThemeProvider>]` per story or globally in `preview.tsx`. Without decorators, components needing context crash.',
      category: 'patterns',
    },
    {
      content:
        'Autodocs from JSDoc: write JSDoc on prop interfaces. The `@storybook/addon-docs` reads them to generate the docs page. Hand-writing duplicate docs is wasted effort.',
      category: 'conventions',
    },
    {
      content:
        '`@storybook/addon-a11y` runs axe-core in stories. Add to `main.ts` addons. Catches accessibility regressions per story — easier than retrofitting accessibility audits later.',
      category: 'testing',
    },
    {
      content:
        'For tests: run interaction tests headlessly with `test-storybook` (Playwright runner). Generates pass/fail reports per story. Integrates with CI as a separate test type from unit/E2E.',
      category: 'testing',
    },
    {
      content:
        'Visual regression: Chromatic (paid) or Loki (free). Stories are perfect for snapshot testing because they\'re isolated and stable. Wire to CI to catch unintended visual changes.',
      category: 'testing',
    },
    {
      content:
        'Static build for hosting: `pnpm build-storybook` outputs to `storybook-static/`. Deploy to Vercel/Netlify/GitHub Pages. Treat as the design system docs site — link from the main repo README.',
      category: 'architecture',
    },
    {
      content:
        'Storybook 8+ uses Vite by default for new projects. Webpack builder is still supported but slower. Migrate Webpack-based projects when you next touch the toolchain.',
      category: 'performance',
    },
    {
      content:
        'Co-locate stories with components: `Button.tsx`, `Button.stories.tsx`, `Button.test.tsx`. Same import paths, refactor-friendly. The `stories` config in `main.ts` should glob `**/*.stories.@(ts|tsx)`.',
      category: 'conventions',
    },
  ],
};
