import { packageExtension } from '@lvce-editor/package-extension'
import fs, { readFileSync, writeFileSync } from 'node:fs'
import path, { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const NOT_NEEDED = [
  'node_modules/prettier/bin-prettier.js',
  'node_modules/prettier/cli.js',
  'node_modules/prettier/doc.js',
  'node_modules/prettier/index.js',
    'node_modules/prettier/parser-angular.js',
  'node_modules/prettier/parser-babel.js',
  'node_modules/prettier/parser-espree.js',
  'node_modules/prettier/parser-flow.js',
  'node_modules/prettier/parser-glimmer.js',
  'node_modules/prettier/parser-graphql.js',
  'node_modules/prettier/parser-html.js',
  'node_modules/prettier/parser-markdown.js',
  'node_modules/prettier/parser-meriyah.js',
  'node_modules/prettier/parser-postcss.js',
  'node_modules/prettier/parser-typescript.js',
  'node_modules/prettier/parser-yaml.js',
  'node_modules/prettier/standalone.js',
  'node_modules/prettier/third-party.js',
]
const __dirname = dirname(fileURLToPath(import.meta.url))

const root = path.join(__dirname, '..')
const extension = path.join(root, 'packages', 'extension')
const prettierWorker = path.join(root, 'packages', 'prettier-worker')

fs.rmSync(join(root, 'dist'), { recursive: true, force: true })

fs.mkdirSync(path.join(root, 'dist'))

const packageJson = JSON.parse(
  readFileSync(join(extension, 'package.json')).toString()
)
delete packageJson.xo
delete packageJson.jest
delete packageJson.prettier
delete packageJson.devDependencies

fs.writeFileSync(
  join(root, 'dist', 'package.json'),
  JSON.stringify(packageJson, null, 2) + '\n'
)
fs.copyFileSync(join(root, 'README.md'), join(root, 'dist', 'README.md'))
fs.copyFileSync(join(extension, 'icon.png'), join(root, 'dist', 'icon.png'))
fs.copyFileSync(
  join(extension, 'extension.json'),
  join(root, 'dist', 'extension.json')
)
fs.cpSync(join(extension, 'src'), join(root, 'dist', 'src'), {
  recursive: true,
})

fs.mkdirSync(
  join(
    root,
    'dist',
    'prettier-worker',
    'third_party',
    'prettier-v3',
    'plugins'
  ),
  {
    recursive: true,
  }
)
for (const file of ['standalone.mjs', 'README.md', 'LICENSE', 'package.json']) {
  fs.cpSync(
    join(prettierWorker, 'third_party', 'prettier-v3', file),
    join(root, 'dist', 'prettier-worker', 'third_party', 'prettier-v3', file),
    {
      recursive: true,
    }
  )
}
const dirents = fs.readdirSync(
  join(prettierWorker, 'third_party', 'prettier-v3', 'plugins')
)
for (const dirent of dirents) {
  if (dirent.endsWith('.mjs')) {
    fs.cpSync(
      join(prettierWorker, 'third_party', 'prettier-v3', 'plugins', dirent),
      join(
        root,
        'dist',
        'prettier-worker',
        'third_party',
        'prettier-v3',
        'plugins',
        dirent
      )
    )
  }
}
fs.cpSync(
  join(prettierWorker, 'src'),
  join(root, 'dist', 'prettier-worker', 'src'),
  {
    recursive: true,
  }
)

const workerUrlFilePath = path.join(
  root,
  'dist',
  'src',
  'parts',
  'PrettierWorkerUrl',
  'PrettierWorkerUrl.js'
)
const oldContent = readFileSync(workerUrlFilePath, 'utf8')
const newContent = oldContent.replace(
  '../../../../prettier-worker/src/prettierWorkerMain.js',
  '../../../prettier-worker/src/prettierWorkerMain.js'
)
writeFileSync(workerUrlFilePath, newContent)

await packageExtension({
  highestCompression: true,
  inDir: join(root, 'dist'),
  outFile: join(root, 'extension.tar.br'),
})
