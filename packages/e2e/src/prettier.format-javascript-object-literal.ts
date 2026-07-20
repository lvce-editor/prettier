import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-object-literal'

const input = 'const user={name:"Ada",active:true}'
const expected = 'const user = { name: "Ada", active: true };\n'

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
