import { replace } from '@lvce-editor/package-extension'
import { exportStatic } from '@lvce-editor/shared-process'
import { cp } from 'node:fs/promises'
import path from 'node:path'
import { root } from './root.js'

await import('./build.js')

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

await replace({
  path: path.join(root, 'dist', commitHash, 'config', 'webExtensions.json'),
  occurrence: 'src/prettierMain.ts',
  replacement: 'dist/prettierMain.js',
})
