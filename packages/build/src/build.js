import {
  bundleJs,
  packageExtension,
  replace,
} from '@lvce-editor/package-extension'
import fs from 'node:fs'
import path, { join } from 'node:path'
import { root } from './root.js'
import { rm } from 'node:fs/promises'

const extension = path.join(root, 'packages', 'extension')
const prettierWorker = path.join(root, 'packages', 'prettier-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json'),
)
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})

fs.mkdirSync(
  join(root, 'dist', 'prettier-worker', 'third_party', 'prettier', 'plugins'),
  {
    recursive: true,
  },
)
for (const file of ['standalone.mjs', 'README.md', 'LICENSE', 'package.json']) {
  fs.cpSync(
    join(root, 'node_modules', 'prettier', file),
    join(root, 'dist', 'prettier-worker', 'third_party', 'prettier', file),
    {
      recursive: true,
    },
  )
}
const dirents = fs.readdirSync(
  join(root, 'node_modules', 'prettier', 'plugins'),
)
for (const dirent of dirents) {
  if (dirent.endsWith('.mjs')) {
    fs.cpSync(
      join(root, 'node_modules', 'prettier', 'plugins', dirent),
      join(
        root,
        'dist',
        'prettier-worker',
        'third_party',
        'prettier',
        'plugins',
        dirent,
      ),
    )
  }
}
fs.cpSync(
  join(prettierWorker, 'src'),
  join(root, 'dist', 'prettier-worker', 'src'),
  {
    recursive: true,
  },
)

const modulePath = path.join(
  root,
  'dist',
  'prettier-worker',
  'src',
  'parts',
  'PrettierModule',
  'PrettierModule.ts',
)

await replace({
  path: modulePath,
  occurrence: '../../../../../node_modules/prettier',
  replacement: '../third_party/prettier',
})

await replace({
  path: join(root, 'dist', 'extension.json'),
  occurrence: 'src/prettierMain.ts',
  replacement: 'dist/prettierMain.js',
})

await replace({
  path: join(root, 'dist', 'extension.json'),
  occurrence: '../prettier-worker/src/prettierWorkerMain.ts',
  replacement: './prettier-worker/dist/prettierWorkerMain.js',
})

await bundleJs(
  join(root, 'dist', 'prettier-worker', 'src', 'prettierWorkerMain.ts'),
  join(root, 'dist', 'prettier-worker', 'dist', 'prettierWorkerMain.js'),
)

await bundleJs(
  join(root, 'dist', 'src', 'prettierMain.ts'),
  join(root, 'dist', 'dist', 'prettierMain.js'),
)

await rm(join(root, 'dist', 'prettier-worker', 'src'), {
  recursive: true,
})

await rm(join(root, 'dist', 'src'), {
  recursive: true,
})

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
