import { packageExtension } from '@lvce-editor/package-extension'
import * as esbuild from 'esbuild'
import fs from 'node:fs'
import path, { join } from 'node:path'
import { copyPrettier } from './copyPrettier.js'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json'),
)
copyPrettier(root, join(root, 'dist'))

await esbuild.build({
  bundle: true,
  entryPoints: [join(extension, 'src', 'prettierMain.ts')],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile: join(root, 'dist', 'dist', 'prettierMain.js'),
  platform: 'browser',
  target: 'esnext',
})

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
