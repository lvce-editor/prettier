import type { Plugin } from 'rollup'
import { packageExtension } from '@lvce-editor/package-extension'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path, { join } from 'node:path'
import { rollup } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import { copyPrettier } from './copyPrettier.ts'
import { root } from './root.ts'

const extension = path.join(root, 'packages', 'extension')
const sandboxWorker = path.join(
  root,
  'packages',
  'nodejs-sandbox-worker',
  'src',
  'nodejsSandboxWorkerMain.ts',
)
const require = createRequire(import.meta.url)
const commonjs = require('@rollup/plugin-commonjs') as () => Plugin

fs.rmSync(join(root, 'dist'), { force: true, recursive: true })

fs.mkdirSync(path.join(root, 'dist'))
fs.mkdirSync(path.join(root, 'dist', 'media'))
fs.mkdirSync(path.join(root, 'dist', 'schemas'))

fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(
  join(extension, 'media', 'icon.png'),
  join(root, 'dist', 'media', 'icon.png'),
)
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json'),
)
fs.cpSync(join(extension, 'schemas'), join(root, 'dist', 'schemas'), {
  recursive: true,
})
copyPrettier(root, join(root, 'dist'))

const bundle = await rollup({
  external: ['electron', 'node:*'],
  input: join(extension, 'src', 'prettierMain.ts'),
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    esbuild({
      define: {
        PRETTIER_PATH_PREFIX: JSON.stringify('../third_party/prettier'),
      },
      target: 'esnext',
    }),
  ],
  treeshake: {
    moduleSideEffects: false,
  },
})

await bundle.write({
  file: join(root, 'dist', 'dist', 'prettierMain.js'),
  format: 'esm',
})

await bundle.close()

const sandboxWorkerBundle = await rollup({
  external: ['electron', 'node:*'],
  input: sandboxWorker,
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    esbuild({
      target: 'esnext',
    }),
  ],
})

await sandboxWorkerBundle.write({
  file: join(root, 'dist', 'dist', 'nodejsSandboxWorkerMain.js'),
  format: 'esm',
})

await sandboxWorkerBundle.close()

const formattingWorkerBundle = await rollup({
  external: ['electron', 'node:*'],
  input: join(extension, 'src', 'formattingWorkerMain.ts'),
  plugins: [
    nodeResolve({
      browser: true,
    }),
    commonjs(),
    esbuild({
      define: {
        PRETTIER_PATH_PREFIX: JSON.stringify('../third_party/prettier'),
      },
      target: 'esnext',
    }),
  ],
})

await formattingWorkerBundle.write({
  file: join(root, 'dist', 'dist', 'formattingWorkerMain.js'),
  format: 'esm',
})

await formattingWorkerBundle.close()

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
