import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-css-keyframes'

const input = '@keyframes fade{from{opacity:0}50%{opacity:.5}to{opacity:1}}'
const expected = `@keyframes fade {
  from {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  to {
    opacity: 1;
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
