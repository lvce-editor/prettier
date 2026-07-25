import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-custom-element'

const input =
  '<user-card data-user-id="42"><span slot="name">Ada</span><button slot="action">Open</button></user-card>'
const expected = `<user-card data-user-id="42"
  ><span slot="name">Ada</span><button slot="action">Open</button></user-card
>
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.html`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
