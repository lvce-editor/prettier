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
const require = createRequire(import.meta.url)
const commonjs =
  require('@rollup/plugin-commonjs') as () => import('rollup').Plugin

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

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
  input: join(extension, 'src', 'prettierMain.ts'),
  external: ['electron', 'node:*'],
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

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
