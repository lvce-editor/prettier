import { exportStatic } from '@lvce-editor/shared-process'
import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

const RE_COMMIT_HASH = /^[a-z\d]+$/
const isCommitHash = (dirent) => {
  return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
}

const dirents = await readdir(path.join(root, 'dist'))
const commitHash = dirents.find(isCommitHash) || ''

for (const dirent of ['src', 'third_party']) {
  await cp(
    path.join(root, 'packages', 'prettier-worker', dirent),
    path.join(
      root,
      'dist',
      commitHash,
      'extensions',
      'builtin.prettier',
      'prettier-worker',
      dirent
    ),
    { recursive: true, force: true }
  )
}

for (const dirent of [
  'bin',
  'plugins/acorn-and-espree.js',
  'plugins/angular.js',
  'plugins/babel.js',
  'plugins/flow.js',
  'plugins/glimmer.js',
  'plugins/graphql.js',
  'plugins/html.js',
  'plugins/markdown.js',
  'plugins/meriyah.js',
  'plugins/postcss.js',
  'plugins/typescript.js',
  'plugins/yaml.js',
  'doc.js',
  'index.cjs',
  'standalone.js',
]) {
  await rm(
    path.join(
      root,
      'dist',
      commitHash,
      'extensions',
      'builtin.prettier',
      'prettier-worker',
      'third_party',
      'prettier-v3',
      dirent
    ),
    {
      recursive: true,
      force: true,
    }
  )
}

const workerUrlFilePath = path.join(
  root,
  'dist',
  commitHash,
  'extensions',
  'builtin.prettier',
  'src',
  'parts',
  'PrettierWorkerUrl',
  'PrettierWorkerUrl.js'
)
const oldContent = await readFile(workerUrlFilePath, 'utf8')
const newContent = oldContent.replace(
  '../../../../prettier-worker/src/prettierWorkerMain.js',
  '../../../prettier-worker/src/prettierWorkerMain.js'
)
await writeFile(workerUrlFilePath, newContent)
