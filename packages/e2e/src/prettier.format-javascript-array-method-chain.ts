import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-array-method-chain'

const input = 'const values=[1,2,3].map(x=>x*2)'
const expected = 'const values = [1, 2, 3].map((x) => x * 2);\n'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, input)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
