import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-markdown-list'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.md`,
    '# Todo\n\n*   first\n* second',
  )
  await Main.openUri(`${tmpDir}/test.md`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`# Todo

- first
- second
`)
}
