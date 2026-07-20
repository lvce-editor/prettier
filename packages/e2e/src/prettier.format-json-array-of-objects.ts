import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-array-of-objects'

const input = '[{"id":1,"active":true},{"id":2,"active":false}]'
const expected = `[
  { "id": 1, "active": true },
  { "id": 2, "active": false }
]
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.json`, input)
  await Main.openUri(`${tmpDir}/test.json`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
