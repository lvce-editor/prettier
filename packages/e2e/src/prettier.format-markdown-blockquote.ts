import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-markdown-blockquote'

const input = '>  First line\n>second line'
const expected = '> First line\n> second line\n'

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
