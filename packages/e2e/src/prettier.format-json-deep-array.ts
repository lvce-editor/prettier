import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-deep-array'

const input =
  '{"matrix":[[1,2,3],[4,5,6],[7,8,9]],"size":{"rows":3,"columns":3}}'
const expected = `{
  "matrix": [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ],
  "size": { "rows": 3, "columns": 3 }
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.json`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
