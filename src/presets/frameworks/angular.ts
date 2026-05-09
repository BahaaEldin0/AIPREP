import type { Preset } from '../../core/types.js';

export const angularPreset: Preset = {
  id: 'angular',
  name: 'Angular',
  description: 'Angular 17+ standalone components, signals, functional guards.',
  type: 'framework',
  rules: [
    {
      content:
        'New components, directives, and pipes are standalone by default (Angular 17+): `@Component({ standalone: true, imports: [...] })`. NgModules are legacy — only use them when integrating with older code.',
      category: 'architecture',
    },
    {
      content:
        'Reactivity: signals (`signal<T>(initial)`, `computed(() => ...)`, `effect(() => ...)`) for local synchronous state. RxJS observables for asynchronous streams (HTTP, WebSocket, complex operators). Convert between with `toSignal(observable$)` / `toObservable(signal)`.',
      category: 'architecture',
    },
    {
      content:
        'Set `changeDetection: ChangeDetectionStrategy.OnPush` on every component. Default change detection runs on every event in the zone — OnPush only on input changes, signal reads, or async pipe emissions. The performance gap is large in real apps.',
      category: 'performance',
    },
    {
      content:
        'Subscribe to observables in templates with `| async`. Manual `.subscribe()` in components leaks unless you `unsubscribe` in `ngOnDestroy` (or use `takeUntilDestroyed()`). The async pipe handles teardown automatically.',
      category: 'patterns',
    },
    {
      content:
        'Functional guards (Angular 16+): `export const authGuard: CanActivateFn = (route, state) => inject(AuthService).isLoggedIn()`. Class guards (`CanActivate` interface) are deprecated. Inject services with `inject()` inside the function.',
      category: 'patterns',
    },
    {
      content:
        'Use the `inject()` function inside constructors, factory functions, and field initializers — NOT in component methods or arbitrary callbacks. It only works inside an injection context.',
      category: 'imports',
    },
    {
      content:
        'Routes in v17+ use `provideRouter(routes)` in the application config. Lazy-load with `loadComponent: () => import(\'./feature\').then(m => m.FeatureComponent)`. NgModule-based `loadChildren` paths are legacy.',
      category: 'architecture',
    },
    {
      content:
        'HTTP client setup: `provideHttpClient(withInterceptors([authInterceptor]))` in app config. Interceptors are functional: `(req, next) => next(req.clone({ setHeaders: { Authorization: token() } }))`.',
      category: 'patterns',
    },
    {
      content:
        'Forms: Reactive forms (`FormBuilder`, `FormGroup`, `FormControl`) over template-driven for anything beyond a search box. Type forms with `FormControl<string>` and the typed forms API — Angular 14+ infers value/error types.',
      category: 'patterns',
    },
    {
      content:
        'Dependency injection scopes: root services (default `providedIn: \'root\'`) are app-singletons; component-level providers create per-instance copies. Be deliberate — accidental component-level providers cause hard-to-debug duplicate state.',
      category: 'architecture',
    },
    {
      content:
        'Trackers in `*ngFor`: always use `trackBy: trackById` for lists with stable IDs. Without trackBy Angular re-creates the DOM on every reference change of the array — even when items are unchanged.',
      category: 'performance',
    },
    {
      content:
        'New control flow (Angular 17+): `@if`, `@for (item of items; track item.id)`, `@switch` directly in templates. Replaces `*ngIf`, `*ngFor`, `*ngSwitch` — the new syntax is faster and has narrower type narrowing.',
      category: 'conventions',
    },
    {
      content:
        'Defer rendering with `@defer (on viewport) { ... } @placeholder { ... }`. The defer block lazy-loads the inner component bundle and only mounts when the trigger fires (viewport, idle, hover, timer).',
      category: 'performance',
    },
    {
      content:
        'TypeScript `strict: true` is non-negotiable. Enable `strictTemplates: true` in `angularCompilerOptions` to type-check templates against component types. Without it, template typos make it to production.',
      category: 'conventions',
    },
    {
      content:
        'Component file naming: `feature.component.ts` (PascalCase class `FeatureComponent`), with sibling `feature.component.html` and `feature.component.scss` if the component is non-trivial. Inline templates fine for ≤30 lines.',
      category: 'conventions',
    },
    {
      content:
        'State management: signals for local component state, services with `signal()` for shared, and a store library (NgRx, NGXS) only when you have many features sharing complex state. Reaching for NgRx on day 1 is overkill.',
      category: 'architecture',
    },
    {
      content:
        'Component selector convention: `app-` prefix for application components (`app-header`), library prefix for libraries (`my-lib-button`). Linter `@angular-eslint/component-selector` enforces this.',
      category: 'conventions',
    },
    {
      content:
        'Take care with `effect()` — it runs in response to signal reads. Writing to signals inside `effect()` causes infinite loops; Angular throws by default. If you genuinely need write-on-read, pass `{ allowSignalWrites: true }` and document why.',
      category: 'errors',
    },
    {
      content:
        'Server-side rendering with Angular Universal: `provideClientHydration()` enables hydration. Browser-only code (`window`, `localStorage`) must be guarded with `isPlatformBrowser(platformId)` or run inside `afterNextRender`.',
      category: 'errors',
    },
    {
      content:
        'Test components with Jasmine + Karma (legacy default) or Jest. Use `TestBed.configureTestingModule` with the standalone component\'s providers. For E2E use Playwright or Cypress, not the deprecated Protractor.',
      category: 'testing',
    },
    {
      content:
        'Build optimization: `ng build --configuration production` enables AOT, tree-shaking, minification. Inspect bundles with `ng build --stats-json && webpack-bundle-analyzer dist/...stats.json`. Budget warnings in `angular.json` catch regressions early.',
      category: 'performance',
    },
    {
      content:
        'CSS encapsulation defaults to `ViewEncapsulation.Emulated` (Angular wraps selectors with attribute matchers). Use `ViewEncapsulation.None` only for the root style component or when you intentionally want global rules.',
      category: 'conventions',
    },
  ],
};
