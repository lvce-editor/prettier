import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-react-syntax-error'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  const text = 'const  element: JSX.Element = <div>{</div>'
  await FileSystem.writeFile(`${tmpDir}/test.tsx`, text)
  await Main.openUri(`${tmpDir}/test.tsx`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(text)
}
