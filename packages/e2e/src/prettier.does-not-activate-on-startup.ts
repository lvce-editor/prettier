import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.does-not-activate-on-startup'

export const test: Test = async ({ expect, Locator, RunningExtensions }) => {
  await RunningExtensions.show()

  const runningExtensions = Locator('.RunningExtensionName')
  await expect(runningExtensions).toHaveCount(0)

  const emptyMessage = Locator('.RunningExtensionsEmpty')
  await expect(emptyMessage).toHaveText('No running extensions')
}
