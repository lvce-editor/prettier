import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-html-svg'

const input =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 1h22v22H1z"></path><circle cx="12" cy="12" r="4"></circle></svg>'
const expected = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M1 1h22v22H1z"></path>
  <circle cx="12" cy="12" r="4"></circle>
</svg>
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.html`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
