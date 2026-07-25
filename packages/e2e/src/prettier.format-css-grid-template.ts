import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-grid-template'

const input = '.layout{display:grid;grid-template-columns:1fr 2fr;gap:16px}'
const expected = `.layout {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.css`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
