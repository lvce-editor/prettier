import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-readonly-tuple'

const input = 'const point:readonly [number,number]=[10,20]'
const expected = 'const point: readonly [number, number] = [10, 20];\n'

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
