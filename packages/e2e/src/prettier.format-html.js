test('prettier.format-html', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.html`, `<h1> hello world </h1>`)
  await Main.openUri(`${tmpDir}/test.html`)

  // act
  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('<h1>hello world</h1>')
})
