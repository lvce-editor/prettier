import { exportStatic } from '@lvce-editor/shared-process'

await exportStatic({
  extensionPath: 'packages/extension',
  testPath: 'packages/e2e',
})
