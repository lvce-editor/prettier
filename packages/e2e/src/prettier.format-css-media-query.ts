import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-media-query'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.css`,
    '@media(min-width:768px){.card{display:grid;gap:16px}}',
  )
  await Main.openUri(`${tmpDir}/test.css`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`@media (min-width: 768px) {
  .card {
    display: grid;
    gap: 16px;
  }
}
`)
}
