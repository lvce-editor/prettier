import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-attributes'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.html`,
    '<input disabled class="field" type="text" placeholder="Name">',
  )
  await Main.openUri(`${tmpDir}/test.html`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(
    '<input disabled class="field" type="text" placeholder="Name" />\n',
  )
}
