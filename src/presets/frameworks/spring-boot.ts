import type { Preset } from '../../core/types.js';

export const springBootPreset: Preset = {
  id: 'spring-boot',
  name: 'Spring Boot',
  description: 'Spring Boot 3+ on Java 17/21 with REST controllers, JPA, validation.',
  type: 'framework',
  rules: [
    {
      content:
        '`@RestController` (combines `@Controller` + `@ResponseBody`) for JSON APIs. `@Controller` alone resolves view names — wrong for APIs, will return 404 for missing view. Use the right annotation for the right purpose.',
      category: 'architecture',
    },
    {
      content:
        '`@Transactional` only takes effect on PUBLIC methods called via Spring proxy. Self-invocation (`this.someMethod()`) bypasses the proxy — the transaction never starts. Either call through a proxied bean or use AspectJ weaving.',
      category: 'errors',
    },
    {
      content:
        'Constructor injection over field injection. Add `@RequiredArgsConstructor` (Lombok) or write the constructor explicitly. Field injection (`@Autowired private X x;`) defeats unmodifiable beans, complicates tests, and obscures dependencies.',
      category: 'architecture',
    },
    {
      content:
        'Configuration via `@ConfigurationProperties(prefix = "app.feature")` bound to a record/class. Beats `@Value("${...}")` scattered everywhere — type-safe, validated at startup, single source.',
      category: 'security',
    },
    {
      content:
        'Validation: Bean Validation (Jakarta `@Valid`, `@NotNull`, `@Size`, `@Email`) on DTOs. Apply with `@Valid @RequestBody UserCreateDto dto`. Failures throw `MethodArgumentNotValidException` → handle in `@ControllerAdvice`.',
      category: 'security',
    },
    {
      content:
        '`@ControllerAdvice` for global exception handling: `@ExceptionHandler(EntityNotFoundException.class) ResponseEntity<ErrorDto> handle(...)`. Without it, default Spring error response leaks stack traces in dev profile and is generic in prod.',
      category: 'errors',
    },
    {
      content:
        'JPA N+1: `@OneToMany` defaults to LAZY (good) but iterating triggers a query per row. Fix with `@EntityGraph(attributePaths = "posts")` on the repository method or `JOIN FETCH` in JPQL. Use `Hibernate.statistics.queryExecutionCount` to detect.',
      category: 'performance',
    },
    {
      content:
        'Spring Data JPA repositories: `interface UserRepository extends JpaRepository<User, Long>` — derived query methods (`findByEmail`) for simple cases, `@Query("...")` for joins, `Specification<T>` for dynamic predicates. Avoid raw `EntityManager` outside special needs.',
      category: 'patterns',
    },
    {
      content:
        'Use DTOs at the boundary, not entities. Returning JPA entities from controllers leaks lazy-loaded relations (LazyInitializationException after session closes) and exposes internal columns.',
      category: 'security',
    },
    {
      content:
        'Profiles: `application.yml` (defaults), `application-prod.yml` (overrides). Activate via `SPRING_PROFILES_ACTIVE=prod`. Sensitive overrides go in environment, not committed files.',
      category: 'security',
    },
    {
      content:
        'Spring Security: configure via `SecurityFilterChain` bean (Spring Security 6+). The old `WebSecurityConfigurerAdapter` is removed. Annotate methods with `@PreAuthorize("hasRole(\'ADMIN\')")` for fine-grained access.',
      category: 'security',
    },
    {
      content:
        'CSRF protection on by default for stateful sessions. For stateless JWT APIs, disable CSRF AND use `SessionCreationPolicy.STATELESS`. Disabling CSRF without going stateless is a security hole.',
      category: 'security',
    },
    {
      content:
        'Logging: SLF4J facade with Logback (`private static final Logger log = LoggerFactory.getLogger(MyClass.class)`). Use parameterized messages (`log.info("user {} signed up", id)`) — avoids string concatenation when log level is disabled.',
      category: 'errors',
    },
    {
      content:
        'Actuator: include `spring-boot-starter-actuator` for health (`/actuator/health`), metrics (`/actuator/metrics`), info, and Prometheus (`/actuator/prometheus`). Restrict exposure in production: `management.endpoints.web.exposure.include=health,prometheus`.',
      category: 'patterns',
    },
    {
      content:
        'Testing: `@SpringBootTest` for full-context integration tests (slow), `@WebMvcTest(UserController.class)` for controller-only slices, `@DataJpaTest` for repository tests. Use Testcontainers for real DB in tests, not H2.',
      category: 'testing',
    },
    {
      content:
        'Database connections: HikariCP is bundled. Tune `spring.datasource.hikari.maximum-pool-size` per workload — defaults assume small apps. Monitor pool saturation; exhaustion shows up as request timeouts.',
      category: 'performance',
    },
    {
      content:
        'Use Java records for DTOs: `public record UserDto(Long id, String email) {}`. Immutable, generates equals/hashCode/toString, fewer lines than POJOs. Available since Java 16.',
      category: 'conventions',
    },
    {
      content:
        'Liquibase or Flyway for schema migrations — committed to repo. NEVER auto-DDL (`spring.jpa.hibernate.ddl-auto=update`) in production. `validate` is fine; `update`/`create` corrupts schemas.',
      category: 'errors',
    },
    {
      content:
        'For async work: `@Async` annotated method + `@EnableAsync`. Returns `CompletableFuture<T>`. Backed by a TaskExecutor — define one (`ThreadPoolTaskExecutor`) and reference by name. Default executor is unbounded — DoS waiting to happen.',
      category: 'performance',
    },
    {
      content:
        'Build: Maven (`pom.xml`) or Gradle Kotlin DSL (`build.gradle.kts`). Pick one and stick to it. Use the Spring Boot plugin\'s repackage goal — `java -jar target/app.jar` runs the fat jar with the embedded server.',
      category: 'patterns',
    },
  ],
};
