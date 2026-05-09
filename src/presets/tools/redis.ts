import type { Preset } from '../../core/types.js';

export const redisPreset: Preset = {
  id: 'redis',
  name: 'Redis',
  description: 'Redis as cache, session store, queue backend.',
  type: 'tool',
  rules: [
    {
      content:
        'NEVER `KEYS *` in production. It blocks the entire server until it returns — for a large keyspace this means seconds of unavailability. Use `SCAN` instead — incremental, non-blocking. `KEYS` is fine ONLY in dev or for small known keyspaces.',
      category: 'errors',
    },
    {
      content:
        'Set TTLs explicitly. `SET key value EX 300` (or `SETEX key 300 value`) instead of plain `SET key value`. Forgetting a TTL means the entry lives forever — caches grow until the eviction policy kicks in.',
      category: 'performance',
    },
    {
      content:
        'Use a connection POOL, not per-operation `connect()`. `ioredis` opens a TCP connection per command if you instantiate per-call. Reuse a singleton client. For many concurrent ops, increase pool size.',
      category: 'performance',
    },
    {
      content:
        'Pipeline multiple commands when latency matters: `redis.pipeline().set(\\\'a\\\', 1).set(\\\'b\\\', 2).exec()`. Sends all commands in one round trip — orders of magnitude faster than serial calls when network RTT dominates.',
      category: 'performance',
    },
    {
      content:
        'Persistence: AOF (append-only file) for durability with the `appendfsync everysec` setting (acceptable durability, fast). RDB (snapshot) for backup and restart speed. Many production setups run BOTH.',
      category: 'architecture',
    },
    {
      content:
        'Key naming convention: `app:resource:id:subkey` (colons for namespacing). Examples: `myapp:user:42:profile`, `myapp:session:abc-123`. The tooling ecosystem (RedisInsight, etc.) renders this hierarchically.',
      category: 'conventions',
    },
    {
      content:
        'For caching with read-through: `const cached = await redis.get(key); if (cached) return JSON.parse(cached); const fresh = await db.fetch(); await redis.set(key, JSON.stringify(fresh), \\\'EX\\\', 300); return fresh`. Wrap in a helper.',
      category: 'patterns',
    },
    {
      content:
        'Cache invalidation patterns: TTL-based (simplest), tag-based via key prefix (`DEL myapp:user:42:*` — but you need SCAN to find them), or version-based (`incr myapp:cache:version` and read `myapp:cache:v123:user:42`). Pick based on access patterns.',
      category: 'patterns',
    },
    {
      content:
        'Use `EVAL` with a Lua script for atomic multi-step operations. Example: rate limiter that reads counter, compares to limit, increments — three commands that need to be atomic. Lua executes server-side without round trips.',
      category: 'patterns',
    },
    {
      content:
        'For pub/sub, use Redis Streams (`XADD`, `XREAD`) over `PUBLISH`/`SUBSCRIBE` if you need persistence and consumer groups. Pub/sub is fire-and-forget; streams have history and consumer offsets.',
      category: 'architecture',
    },
    {
      content:
        'Memory cap and eviction policy: `maxmemory 1gb`, `maxmemory-policy allkeys-lru`. Without a cap, Redis OOMs. Without an eviction policy, sets fail with OOM errors when full.',
      category: 'errors',
    },
  ],
};
