import {
  packageExtension,
  bundleJs,
  replace,
} from '@lvce-editor/package-extension'
import fs, { readFileSync } from 'node:fs'
import path, { join } from 'node:path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const prettierWorker = path.join(root, 'packages', 'prettier-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json')).toString(),
)
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(
  join(root, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n',
)
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

const assetDirPath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'AssetDir',
  'AssetDir.ts',
)

await replace({
  path: assetDirPath,
  occurrence: '../../../../',
  replacement: '../',
})

const workerUrlFilePath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'PrettierWorkerUrl',
  'PrettierWorkerUrl.ts',
)
await replace({
  path: workerUrlFilePath,
  occurrence: 'src/prettierWorkerMain.ts',
  replacement: 'dist/prettierWorkerMain.js',
})

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

await bundleJs(
  join(root, 'dist', 'prettier-worker', 'src', 'prettierWorkerMain.ts'),
  join(root, 'dist', 'prettier-worker', 'dist', 'prettierWorkerMain.js'),
)

await bundleJs(
  join(root, 'dist', 'src', 'prettierMain.ts'),
  join(root, 'dist', 'dist', 'prettierMain.js'),
)

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
