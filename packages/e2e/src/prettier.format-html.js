test('prettier.format-html', async () => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.html`, `<h1> hello world </h1>`)
  await Main.openUri(`${tmpDir}/test.html`)

  // TODO test that formatting works as expected
})
