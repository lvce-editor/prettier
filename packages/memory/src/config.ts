import { join } from 'node:path'
import { root } from './root.ts'

// Baseline: 4,904,104 bytes on Linux; the threshold leaves headroom for CI platform variance.
export const threshold = 5_500_000

export const workerPath = join(root, 'dist', 'dist', 'prettierMain.js')

export const playwrightPath = new URL(
  '../../../node_modules/playwright/index.mjs',
  import.meta.url,
).toString()
