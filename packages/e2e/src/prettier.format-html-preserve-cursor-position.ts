import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-preserve-cursor-position'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.html`, `<h1  >hello world</h1>`)
  await Main.openUri(`${tmpDir}/test.html`)
  await Editor.setCursor(0, 5)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('<h1>hello world</h1>')
  await Editor.shouldHaveSelections(new Uint32Array([1, 3, 1, 3]))
}
