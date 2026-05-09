import type { Preset } from '../../core/types.js';

export const goStdlibPreset: Preset = {
  id: 'go-stdlib',
  name: 'Go (net/http + std)',
  description: 'Go 1.22+ standard library HTTP server with idiomatic patterns.',
  type: 'framework',
  rules: [
    {
      content:
        'Go 1.22 added pattern-matching to `http.ServeMux`: `mux.HandleFunc("GET /users/{id}", handler)`. Use it for new code. Third-party routers (chi, gorilla/mux) remain useful for sub-routers, middleware composition, and trailing-slash handling.',
      category: 'architecture',
    },
    {
      content:
        'Always propagate `context.Context` through the call stack. HTTP handlers receive it via `r.Context()`. Pass it to DB calls, HTTP clients, and any function that does I/O. Cancellation depends on it.',
      category: 'patterns',
    },
    {
      content:
        'Deadlines on outbound HTTP calls: `req, _ := http.NewRequestWithContext(ctx, "GET", url, nil); client.Do(req)`. The default `http.Client` has NO timeout — a hung peer can stall your whole server. Set `Client{Timeout: 5 * time.Second}` at the package level.',
      category: 'errors',
    },
    {
      content:
        'Wrap errors with context: `fmt.Errorf("loadUser %d: %w", id, err)`. The `%w` verb preserves the chain for `errors.Is(err, sql.ErrNoRows)` and `errors.As(err, &myErr)`. Plain `%v` loses the wrapped error.',
      category: 'errors',
    },
    {
      content:
        'Distinguish error categories with sentinel errors (`errors.Is`) for known states (`io.EOF`, `sql.ErrNoRows`) and typed errors (`errors.As`) for those carrying data. Avoid string-comparing error messages.',
      category: 'errors',
    },
    {
      content:
        'Middleware is `func(http.Handler) http.Handler`. Compose with chains (`alice` library) or hand-rolled: `mux := loggingMiddleware(authMiddleware(router))`. Each layer wraps the next; order is outside-in.',
      category: 'architecture',
    },
    {
      content:
        'Decode JSON bodies with `json.NewDecoder(r.Body).Decode(&v)` — streaming, lower memory than `io.ReadAll` + `json.Unmarshal`. Set `decoder.DisallowUnknownFields()` to reject unexpected keys (anti-tampering).',
      category: 'security',
    },
    {
      content:
        'Set body size limits: `r.Body = http.MaxBytesReader(w, r.Body, 1<<20)`. Without this, an attacker can post a multi-GB body and exhaust memory. Apply per route or in middleware.',
      category: 'security',
    },
    {
      content:
        'Graceful shutdown: catch SIGTERM/SIGINT, call `server.Shutdown(ctx)` with a deadline. The server stops accepting new connections and waits for in-flight ones up to the deadline. `os.Exit(1)` skips this — don\'t.',
      category: 'patterns',
    },
    {
      content:
        'Goroutines need owners. Every `go func() {...}` should: (1) be limited (worker pool, semaphore, errgroup), (2) be cancelable via context, (3) have its panic recovered. Anonymous goroutines that escape the request lifetime are leaks waiting to happen.',
      category: 'patterns',
    },
    {
      content:
        'Use `errgroup.WithContext` for fan-out: `g, ctx := errgroup.WithContext(ctx); for _, x := range xs { g.Go(func() error {...}) }; return g.Wait()`. First error cancels siblings via context.',
      category: 'patterns',
    },
    {
      content:
        '`defer` runs at function return — careful inside loops. `for _, f := range files { f.Open(); defer f.Close() }` defers ALL closes to function exit, leaking file handles. Wrap the body in a closure or close explicitly.',
      category: 'errors',
    },
    {
      content:
        'Table-driven tests: `tests := []struct{ name string; in T; want T; wantErr bool }{...}` then `for _, tt := range tests { t.Run(tt.name, func(t *testing.T) {...}) }`. Idiomatic, easy to extend, parallel-safe with `t.Parallel()`.',
      category: 'testing',
    },
    {
      content:
        'Embed static files with `//go:embed` directive: `//go:embed templates/*` then `var templates embed.FS`. Compiles assets into the binary — no runtime path issues, single artifact deploys.',
      category: 'patterns',
    },
    {
      content:
        'Logging: `log/slog` (stdlib, Go 1.21+) for structured logging. `slog.Info("user signup", "user_id", id)`. JSON handler for production: `slog.NewJSONHandler(os.Stdout, nil)`. Avoid `log.Printf` — unstructured.',
      category: 'errors',
    },
    {
      content:
        'Configuration: env vars via `os.Getenv` with explicit defaults, OR a typed struct populated by `kelseyhightower/envconfig` or `caarlos0/env`. Validate at startup; missing keys = fatal.',
      category: 'security',
    },
    {
      content:
        'Zero-value initialization is your friend: `var users []User` works (nil slice). `make([]User, 0, 100)` only when you know the cap up front. Pre-allocating reduces allocations on append.',
      category: 'performance',
    },
    {
      content:
        'Database: `database/sql` + a driver (`pgx/v5/stdlib` for Postgres). Set `db.SetMaxOpenConns`, `db.SetMaxIdleConns`, `db.SetConnMaxLifetime` — defaults are too generous for production.',
      category: 'performance',
    },
  ],
};
