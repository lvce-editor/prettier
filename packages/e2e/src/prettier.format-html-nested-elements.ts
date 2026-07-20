import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-nested-elements'

const input = '<main><section><h1>Title</h1><p>Paragraph</p></section></main>'
const expected = `<main>
  <section>
    <h1>Title</h1>
    <p>Paragraph</p>
  </section>
</main>
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
