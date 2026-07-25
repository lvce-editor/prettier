import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-comment'

const input =
  '<main><!-- primary content --><section><h2>Title</h2><p>Text</p></section></main>'
const expected = `<main>
  <!-- primary content -->
  <section>
    <h2>Title</h2>
    <p>Text</p>
  </section>
</main>
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.html`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
