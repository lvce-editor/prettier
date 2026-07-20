import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-generic-function'

const input = 'const identity=<T>(value:T):T=>value'
const expected = 'const identity = <T,>(value: T): T => value;\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.ts`, input)
  await Main.openUri(`${tmpDir}/test.ts`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
