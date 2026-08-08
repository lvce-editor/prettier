import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-react'

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
    `${tmpDir}/test.tsx`,
    `const  element: JSX.Element=<div>Hello</div>`,
  )
  await Main.openUri(`${tmpDir}/test.tsx`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    `const element: JSX.Element = <div>Hello</div>;`,
  )
}
