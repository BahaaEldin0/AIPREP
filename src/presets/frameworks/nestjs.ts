import type { Preset } from '../../core/types.js';

export const nestjsPreset: Preset = {
  id: 'nestjs',
  name: 'NestJS',
  description: 'NestJS modules, DI, guards, interceptors, exception filters.',
  type: 'framework',
  rules: [
    {
      content:
        'Organize by domain modules, not by file type. `users/` module contains `users.controller.ts`, `users.service.ts`, `users.module.ts`, `users.repository.ts`, `dto/`. The `AppModule` imports feature modules — never put business logic there.',
      category: 'architecture',
    },
    {
      content:
        'Module imports (`imports: [...]`) bring in OTHER modules (with their exported providers). Providers (`providers: [...]`) are services scoped to THIS module unless re-exported. Mixing them is the most common Nest beginner error — Nest will throw "Nest cannot resolve" at runtime.',
      category: 'architecture',
    },
    {
      content:
        'DTOs use `class-validator` decorators (`@IsString`, `@IsEmail`, `@MinLength`) plus `class-transformer` (`@Type`, `@Expose`). Apply `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` globally — drops unknown fields and coerces types.',
      category: 'security',
    },
    {
      content:
        'Default DI scope is `Scope.DEFAULT` (singleton, app-wide). `Scope.REQUEST` creates a new instance per request — heavy because it cascades through the dep tree. `Scope.TRANSIENT` is per consumer. Use REQUEST sparingly; almost always DEFAULT.',
      category: 'architecture',
    },
    {
      content:
        'Guards (`CanActivate` interface, or functional guard) authorize before the route runs — return false to 403. Roles guard pattern: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(\'admin\')` decorator. JWT extracts the user; Roles checks against route metadata.',
      category: 'security',
    },
    {
      content:
        'Interceptors run AFTER guards but wrap the handler. Use for: response shaping (`map(data => ({ data, ts: Date.now() }))`), timing logs, transactions. Order: Middleware → Guards → Interceptors (before) → Pipes → Handler → Interceptors (after) → Exception filters.',
      category: 'architecture',
    },
    {
      content:
        'Exception filters catch thrown errors and shape responses: `@Catch(HttpException) class HttpErrorFilter implements ExceptionFilter`. Apply globally with `app.useGlobalFilters(...)` or per-controller with `@UseFilters(...)`. Without one, default filter exposes raw error details — bad in production.',
      category: 'errors',
    },
    {
      content:
        'Pipes transform/validate single arguments: `@Param(\'id\', ParseUUIDPipe) id: string`. Built-ins: `ParseIntPipe`, `ParseBoolPipe`, `ParseUUIDPipe`, `ParseEnumPipe`. Always validate path/query params with a pipe — strings from the URL are not safe.',
      category: 'security',
    },
    {
      content:
        'Constructor injection only: `constructor(private readonly users: UsersService) {}`. Property injection (`@Inject() private users`) and field initialization with `inject()` defeat testability and are inconsistent with Nest\'s DI model.',
      category: 'patterns',
    },
    {
      content:
        'Configuration via `@nestjs/config` (`ConfigModule.forRoot({ validationSchema, isGlobal: true })`). Validate with `joi` or zod at startup — fail fast on missing keys. Inside services: `constructor(private cfg: ConfigService) {}` then `cfg.get<string>(\'DATABASE_URL\')`.',
      category: 'patterns',
    },
    {
      content:
        'Use repositories for data access (TypeORM `@InjectRepository`, Prisma module pattern, Mongoose `@InjectModel`). Services orchestrate; repositories query. Controllers know NOTHING about ORM.',
      category: 'architecture',
    },
    {
      content:
        'Custom decorators compose existing ones: `export const CurrentUser = createParamDecorator((data, ctx) => ctx.switchToHttp().getRequest().user)`. Reuse across controllers — eliminates `@Req() req` repetition.',
      category: 'patterns',
    },
    {
      content:
        'Circular dependencies between modules/providers: refactor first (extract a third module), use `forwardRef(() => ModuleB)` only as a last resort. Forward refs are a DI footgun — Nest may resolve to undefined depending on import order.',
      category: 'architecture',
    },
    {
      content:
        'For async module setup (e.g., DB connection that needs env): `XxxModule.forRootAsync({ useFactory: (cfg) => ({...}), inject: [ConfigService] })`. Synchronous `forRoot` cannot read injected providers.',
      category: 'patterns',
    },
    {
      content:
        'Microservices: pick a transport (`Transport.TCP`, `Transport.REDIS`, `Transport.NATS`, `Transport.GRPC`). Hybrid apps run HTTP + microservice in one process — useful for gradual migration.',
      category: 'architecture',
    },
    {
      content:
        'For background jobs use `@nestjs/bull` (Redis-backed queue). Process jobs in a `@Processor` class, schedule via `@nestjs/schedule` (cron). Keep job handlers idempotent — retries are inevitable.',
      category: 'patterns',
    },
    {
      content:
        'Database transactions belong in services. Inject the manager (TypeORM: `EntityManager`; Prisma: pass tx client) and call all repository methods on it. Without explicit tx propagation, multi-step writes are partial-on-failure.',
      category: 'architecture',
    },
    {
      content:
        'Swagger/OpenAPI via `@nestjs/swagger`. Decorate DTOs with `@ApiProperty`, controllers with `@ApiTags`/`@ApiOperation`. Generated `swagger.json` is the contract; keep it accurate or it lies to clients.',
      category: 'conventions',
    },
    {
      content:
        'Log via `Logger` from `@nestjs/common` (singleton or per-class with context). Configure `LoggerService` for production formats (JSON via pino). NEVER `console.log` — Nest\'s logger respects log levels and context.',
      category: 'errors',
    },
    {
      content:
        'Test services with plain Jest — instantiate with mock dependencies. Test controllers via the HTTP layer with `Test.createTestingModule({...}).compile()` and supertest against `app.getHttpServer()`. E2E tests have their own `*.e2e-spec.ts`.',
      category: 'testing',
    },
    {
      content:
        'Graceful shutdown: enable `app.enableShutdownHooks()` and implement `OnModuleDestroy`/`OnApplicationShutdown` on providers that need cleanup (close DB, drain queues). Without enabling hooks, signal-driven shutdown skips them.',
      category: 'patterns',
    },
    {
      content:
        'CORS: `app.enableCors({ origin: env.FRONTEND_URL, credentials: true })`. Helmet via `app.use(helmet())`. Validation pipe global. Rate limit via `@nestjs/throttler` with the `@Throttle` decorator on sensitive routes.',
      category: 'security',
    },
  ],
};
