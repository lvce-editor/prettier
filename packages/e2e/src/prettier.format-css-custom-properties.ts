import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-custom-properties'

const input =
  ':root{--brand-color:#336699;--spacing-unit:8px}.button{color:var(--brand-color);margin:var(--spacing-unit)}'
const expected = `:root {
  --brand-color: #336699;
  --spacing-unit: 8px;
}
.button {
  color: var(--brand-color);
  margin: var(--spacing-unit);
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.css`, input)
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
