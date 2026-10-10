import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-syntax-error'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
  Output,
  Panel,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = 'type  User = { name: string'
  await FileSystem.writeFile(`${tmpDir}/test.ts`, text)
  await Main.openUri(`${tmpDir}/test.ts`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)

  await Panel.open('Output')
  await Output.selectChannel('prettier')
  const outputContent = Locator('.OutputContent')
  await expect(outputContent).toContainText('Failed to format')
  await expect(outputContent).toContainText("'}' expected")
}
