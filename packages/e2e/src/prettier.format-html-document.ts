import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-document'

const input =
  '<!doctype html><html><head><title>Test</title></head><body><h1>Hello</h1></body></html>'
const expected = `<!doctype html>
<html>
  <head>
    <title>Test</title>
  </head>
  <body>
    <h1>Hello</h1>
  </body>
</html>
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.html`, input)
  await Main.openUri(`${tmpDir}/test.html`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
