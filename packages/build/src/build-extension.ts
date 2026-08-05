import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path from 'node:path'
import { root } from './root.ts'

const extension = path.join(root, 'packages', 'extension')
const sandboxWorker = path.join(
  root,
  'packages',
  'nodejs-sandbox-worker',
  'src',
  'nodejsSandboxWorkerMain.ts',
)
const nodeEntryPoint = path.join(
  root,
  'packages',
  'node',
  'src',
  'prettierNodeMain.ts',
)
const entryPoint = path.join(extension, 'src', 'prettierMain.ts')
const outdir = path.join(extension, 'dist')
const outfile = path.join(outdir, 'prettierMain.js')

fs.rmSync(outdir, { recursive: true, force: true })
fs.mkdirSync(outdir, { recursive: true })

await esbuild.build({
  bundle: true,
  define: {
    PRETTIER_PATH_PREFIX: JSON.stringify('../../../node_modules/prettier'),
  },
  entryPoints: [entryPoint],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile,
  platform: 'browser',
  sourcemap: true,
  target: 'esnext',
})

await esbuild.build({
  bundle: true,
  entryPoints: [nodeEntryPoint],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile: path.join(outdir, 'prettierNodeMain.js'),
  platform: 'node',
  sourcemap: true,
  target: 'node22',
})

await esbuild.build({
  bundle: true,
  entryPoints: [sandboxWorker],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile: path.join(outdir, 'nodejsSandboxWorkerMain.js'),
  platform: 'browser',
  sourcemap: true,
  target: 'esnext',
})
