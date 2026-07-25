import { packageExtension } from '@lvce-editor/package-extension'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path, { join } from 'node:path'
import { rollup } from 'rollup'
import { build as esbuildBuild } from 'esbuild'
import esbuild from 'rollup-plugin-esbuild'
import { copyPrettier } from './copyPrettier.ts'
import {
  type ExtensionManifest,
  withProductionNodeEntryPoint,
} from './extensionManifest.ts'
import { root } from './root.ts'

const extension = path.join(root, 'packages', 'extension')
const node = path.join(root, 'packages', 'node')
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
const extensionManifest = JSON.parse(
  fs.readFileSync(join(extension, 'extension.json'), 'utf8'),
) as ExtensionManifest
fs.writeFileSync(
  join(root, 'dist', 'extension.json'),
  `${JSON.stringify(withProductionNodeEntryPoint(extensionManifest), undefined, 2)}\n`,
)
fs.cpSync(join(extension, 'schemas'), join(root, 'dist', 'schemas'), {
  recursive: true,
})
copyPrettier(root, join(root, 'dist'))

await esbuildBuild({
  bundle: true,
  entryPoints: [join(node, 'src', 'prettierNode.ts')],
  format: 'esm',
  outdir: join(root, 'dist', 'node', 'dist'),
  platform: 'node',
  target: 'node24',
})

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
