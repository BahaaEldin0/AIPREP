import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    dts: true,
    clean: true,
    shims: true,
    banner: { js: '#!/usr/bin/env node' },
    target: 'node18',
  },
  {
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: true,
    shims: true,
    target: 'node18',
  },
]);
