import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-markdown-table'

const input = '|name|role|\n|-|-|\n|Ada|admin|\n|Grace|editor|'
const expected = `| name  | role   |
| ----- | ------ |
| Ada   | admin  |
| Grace | editor |
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.md`, input)
  await Main.openUri(`${tmpDir}/test.md`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
