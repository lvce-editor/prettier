import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-form'

const input =
  '<form action="/submit" method="post"><label for="name">Name</label><input id="name" name="name" required><button type="submit">Save</button></form>'
const expected = `<form action="/submit" method="post">
  <label for="name">Name</label><input id="name" name="name" required /><button
    type="submit"
  >
    Save
  </button>
</form>
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.html`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
