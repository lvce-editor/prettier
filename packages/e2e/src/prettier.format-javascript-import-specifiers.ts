import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-import-specifiers'

const input = `import{readFile,writeFile}from'node:fs/promises'
export{readFile,writeFile}`
const expected = `import { readFile, writeFile } from "node:fs/promises";
export { readFile, writeFile };
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.js`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
