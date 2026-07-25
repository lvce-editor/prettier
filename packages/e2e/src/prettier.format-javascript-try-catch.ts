import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-try-catch'

const input = `async function load(){try{return await fetch('/api')}catch(error){console.error(error);throw error}}`
const expected = `async function load() {
  try {
    return await fetch("/api");
  } catch (error) {
    console.error(error);
    throw error;
  }
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.js`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
