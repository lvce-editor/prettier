import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-package-json'

export const skip = 1

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/package.json`,
    `{ "scripts" : { "test" : "echo ok" } }`,
  )
  await Main.openUri(`${tmpDir}/package.json`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('{  "scripts": {    "test": "echo ok"  }}')
}
