import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-pseudo-selectors'

const input =
  '.button:hover,.button:focus-visible{color:rgb(255,0,0);text-decoration:none}'
const expected = `.button:hover,
.button:focus-visible {
  color: rgb(255, 0, 0);
  text-decoration: none;
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
