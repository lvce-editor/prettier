import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-multiple-declarations'

const input = '.card{color:red;background:white;padding:8px 16px}'
const expected = `.card {
  color: red;
  background: white;
  padding: 8px 16px;
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.css`, input)
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
