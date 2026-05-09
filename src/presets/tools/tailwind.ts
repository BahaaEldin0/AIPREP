import type { Preset } from '../../core/types.js';

export const tailwindPreset: Preset = {
  id: 'tailwind',
  name: 'Tailwind CSS',
  description: 'Tailwind utility-first CSS with v3/v4 conventions.',
  type: 'tool',
  rules: [
    {
      content:
        'Apply utilities directly to elements: `<div className="flex items-center gap-2 p-4">`. The whole point of Tailwind is colocation — abstracting back into custom CSS classes (`.card { @apply ... }`) defeats it. Extract a COMPONENT instead, not a class.',
      category: 'conventions',
    },
    {
      content:
        'For conditional/dynamic classes use a `cn()` helper that combines `clsx` + `tailwind-merge`: `cn(\'p-2\', isActive && \'bg-blue-500\', className)`. Without `tailwind-merge`, conflicting utilities (`p-2 p-4`) both end up in the DOM and the wrong one might win.',
      category: 'patterns',
    },
    {
      content:
        'The `content` paths in `tailwind.config.js`/`tailwind.config.ts` MUST include every file with className strings (`./src/**/*.{ts,tsx}`, `./pages/**/*.tsx`). Missing a path = utilities silently absent in the build because Tailwind\'s JIT scans only listed files.',
      category: 'conventions',
    },
    {
      content:
        'Mobile-first responsive: no prefix = all sizes; `sm:` = 640px+; `md:` = 768px+; `lg:` = 1024px+. Write base styles first, then add wider-screen overrides. Reverse order (`lg:p-8 p-4`) works but reads backwards.',
      category: 'patterns',
    },
    {
      content:
        'Dark mode: configure `darkMode: \'class\'` (toggle via `<html class="dark">`) for user preference, or `darkMode: \'media\'` for `prefers-color-scheme`. Class strategy lets you remember the user\'s choice; media follows the OS.',
      category: 'patterns',
    },
    {
      content:
        'Avoid `@apply` outside of a `@layer components` block. `@apply` mid-stylesheet generates duplicate utility CSS and breaks Tailwind\'s purge logic. If you find yourself reaching for it, extract a component.',
      category: 'performance',
    },
    {
      content:
        'Dynamic class names from data MUST be safelisted. `<div className={\\`bg-${color}-500\\`}>` — Tailwind\'s scanner sees the template literal as a string, not the resolved utility. Either list values in `safelist` (config) or use a static map: `{ red: \'bg-red-500\', blue: \'bg-blue-500\' }[color]`.',
      category: 'errors',
    },
    {
      content:
        'Group utilities in a consistent order: layout (display, position) → box model (width, padding, margin) → typography → colors → effects. Even better: use a Prettier plugin (`prettier-plugin-tailwindcss`) for automatic ordering — eliminates code review noise.',
      category: 'conventions',
    },
    {
      content:
        'Arbitrary values `bg-[#ff0000]`, `w-[37px]` are an escape hatch. Used sparingly they\'re fine; used everywhere they signal you should add a token to `theme.extend`. Tokenize repeated values.',
      category: 'conventions',
    },
    {
      content:
        'Reference theme values from CSS via `theme()`: `box-shadow: 0 1px 2px theme(colors.gray.300)`. Beats hardcoded hex in stylesheets — when you swap colors in config, custom CSS updates too.',
      category: 'patterns',
    },
    {
      content:
        '`prose` (from `@tailwindcss/typography` plugin) for rendered Markdown / CMS content. Sets sensible typography defaults that would take dozens of utility classes manually. Customize via `prose-headings:font-semibold` etc.',
      category: 'patterns',
    },
    {
      content:
        'For component variants use `tailwind-variants` or `class-variance-authority`. Beats hand-rolled lookup objects: type-safe variant + compound variant API, integrates with `cn()`. Keeps button/input sizing logic readable.',
      category: 'patterns',
    },
    {
      content:
        'Tailwind v4 changes: configuration moves to CSS via `@theme` directive; the JS config is legacy. If you\'re on v3, plan the migration but don\'t mix syntaxes mid-project.',
      category: 'architecture',
    },
    {
      content:
        'Spacing scale: stick to the default scale (`p-2`, `p-4`, `p-8`) — multiples of 4px (0.25rem). Custom spacings break visual rhythm. Override the scale in config if your design system demands different values.',
      category: 'conventions',
    },
  ],
};
