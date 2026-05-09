import type { Preset } from '../../core/types.js';

export const reactVitePreset: Preset = {
  id: 'react-vite',
  name: 'React + Vite',
  description: 'Single-page React app on Vite (no SSR framework).',
  type: 'framework',
  rules: [
    {
      content:
        'Use functional components with TypeScript prop interfaces. Class components are legacy — error boundaries are the only remaining valid use, and even those can be wrapped (`react-error-boundary` provides a hook-friendly version).',
      category: 'architecture',
    },
    {
      content:
        'Custom hooks live in `src/hooks/` (or beside the feature) and start with `use` — that prefix is what enables the rules-of-hooks lint and React DevTools introspection. A function that calls hooks but is not named `use*` is a bug waiting to happen.',
      category: 'patterns',
    },
    {
      content:
        'State escalation order: `useState` → lift to closest common parent → `useContext` → external store (Zustand/Jotai). Reach for Redux Toolkit only when you need time-travel debugging or RTK Query — otherwise it is overkill in 2026.',
      category: 'architecture',
    },
    {
      content:
        'The `useEffect` dependency array MUST list every reactive value referenced inside. Lying to the linter (`// eslint-disable-line react-hooks/exhaustive-deps`) is the #1 source of stale-closure bugs. If a dep is unstable, fix the upstream instead — wrap in `useCallback`/`useMemo`, or use a ref.',
      category: 'patterns',
    },
    {
      content:
        'Memoize only when you have a measured re-render problem AND the child is `React.memo`-wrapped. `useMemo`/`useCallback` are not free — they allocate dep arrays and run on every render. Premature memoization is the second-largest source of bugs after dependency lies.',
      category: 'performance',
    },
    {
      content:
        'Organize files by feature, not by file type. `src/features/auth/{components,hooks,api,types}.ts` beats `src/{components,hooks,api,types}/auth/...`. Feature folders make moves and deletions trivial.',
      category: 'architecture',
    },
    {
      content:
        'Naming convention: event handlers are `handleClick`/`handleSubmit`; the prop a parent passes is `onClick`/`onSubmit`. Mixing them up makes call-site code unreadable.',
      category: 'conventions',
    },
    {
      content:
        'Wrap each major feature subtree in an `ErrorBoundary` (a class component or `react-error-boundary`\'s component). Without one, a render error in any child unmounts the entire React tree and shows a blank page.',
      category: 'errors',
    },
    {
      content:
        'For complex forms (more than ~3 fields, validation, or async submission), use `react-hook-form` with `zod` resolvers. Hand-rolled controlled forms become a tangle of `useState`+`useEffect`+stale closures within a sprint.',
      category: 'patterns',
    },
    {
      content:
        'List keys must be stable, unique IDs from the data — never `index`. The only exception is a list that is provably static AND never reordered/inserted/filtered. The bug from `key={index}` shows up as inputs swapping values when items reorder.',
      category: 'patterns',
    },
    {
      content:
        'Code-split routes with `React.lazy(() => import(\'./Page\'))` and wrap in `<Suspense fallback={...}>`. The dynamic import path must be a literal string — Vite uses it for chunk discovery; concatenated strings will not split.',
      category: 'performance',
    },
    {
      content:
        '`<React.StrictMode>` in development double-invokes setup/cleanup of effects, state initializers, and renders. This is intentional — it surfaces side-effect bugs. If a feature only works without StrictMode, the feature is broken.',
      category: 'patterns',
    },
    {
      content:
        'Vite environment variables MUST start with `VITE_` to be exposed to client code (read via `import.meta.env.VITE_FOO`). Anything not prefixed is unavailable at runtime — rename, do not work around.',
      category: 'security',
    },
    {
      content:
        'Static assets imported via `import logo from \'./logo.svg\'` are URL-fingerprinted by Vite. Files in `public/` are served at the root with no fingerprinting — use only for files that must keep a fixed name (e.g., `favicon.ico`, `robots.txt`).',
      category: 'conventions',
    },
    {
      content:
        'Path aliases in `vite.config.ts` (`resolve.alias`) MUST be mirrored in `tsconfig.json` `paths` and in test config (`vitest.config.ts`). A drift means imports work in one tool and fail in another.',
      category: 'imports',
    },
    {
      content:
        'For DOM access (focus, scroll position, measuring), use `useRef<HTMLDivElement>(null)` + `ref={ref}`. NEVER reach for `document.querySelector` from a component — the timing relative to React commit is undefined and breaks under StrictMode.',
      category: 'patterns',
    },
    {
      content:
        'Forward refs from custom components with `forwardRef<HTMLButtonElement, Props>(...)`. Without it, parents passing `ref` get a runtime warning and the ref is null. React 19 may relax this; until then, components meant to compose with form libraries need it.',
      category: 'patterns',
    },
    {
      content:
        'Routing: `react-router-dom` v6+ with the data router (`createBrowserRouter`) for loaders/actions, OR `@tanstack/react-router` for type-safe routes. Avoid v5 patterns (`<Switch>`, `useHistory`) — they are gone.',
      category: 'architecture',
    },
    {
      content:
        'Style with Tailwind, CSS Modules, or vanilla-extract — NOT runtime CSS-in-JS (Styled Components, Emotion). Runtime CSS-in-JS adds a serialization cost on every render and ships emotion\'s runtime to the browser. Pre-extract or use utility CSS.',
      category: 'performance',
    },
    {
      content:
        'Component file naming: PascalCase matching the export (`UserProfile.tsx` exports `UserProfile`). One default-styled component per file is fine, but prefer named exports — they refactor cleaner across many files.',
      category: 'conventions',
    },
    {
      content:
        'Use absolute imports via the `@/` alias for cross-feature paths (`@/features/auth/api`). Reserve relative imports (`./Form`, `../utils`) for siblings within the same feature. Mixing both patterns randomly makes moves expensive.',
      category: 'imports',
    },
    {
      content:
        'Test components with `@testing-library/react` + Vitest. Render under the same providers the app uses (theme, query client, router) — wrap with a `renderWithProviders` helper. Querying by role/label, not test-id, keeps tests resilient to markup changes.',
      category: 'testing',
    },
    {
      content:
        'Production builds: `vite build` outputs to `dist/`. Serve as static files (any CDN), or via a thin server. `import.meta.env.PROD` is true in production builds — gate dev-only code with it (e.g., MSW handlers).',
      category: 'patterns',
    },
    {
      content:
        'Browser dev tooling: install React DevTools and the Vite-specific @vitejs/plugin-react which enables Fast Refresh. Hot-reloading state survives across edits to component bodies but resets on hooks-shape changes (added/removed hook).',
      category: 'patterns',
    },
  ],
};
