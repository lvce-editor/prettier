import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-async-function'

const input =
  'async function load(){const result=await fetch("/api");return result.json()}'
const expected = `async function load() {
  const result = await fetch("/api");
  return result.json();
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, input)
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
