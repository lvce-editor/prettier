test.skip('prettier.format-html-preserve-cursor-position', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.html`, `<h1  >hello world</h1>`)
  await Main.openUri(`${tmpDir}/test.html`)

  // act
  await Editor.format()
  await Editor.setCursor(0, 5)

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('<h1>hello world</h1>')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('left', '27px')
})
