import { exportStatic } from '@lvce-editor/shared-process'
import { cp } from 'node:fs/promises'
import path from 'node:path'
import { root } from './root.ts'

await import('./build.ts')

await cp(path.join(root, 'dist'), path.join(root, 'dist2'), {
  recursive: true,
  force: true,
})

const { commitHash } = await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
  root,
})

await cp(
  path.join(root, 'dist2'),
  path.join(root, 'dist', commitHash, 'extensions', 'builtin.prettier'),
  { recursive: true, force: true },
)
