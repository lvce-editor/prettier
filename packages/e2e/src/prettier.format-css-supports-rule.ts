import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-supports-rule'

const input = '@supports(display:grid){.layout{display:grid;gap:1rem}}'
const expected = `@supports (display: grid) {
  .layout {
    display: grid;
    gap: 1rem;
  }
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
