import { exportStatic } from '@lvce-editor/shared-process'
import { cp, readdir } from 'node:fs/promises'
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
