import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-json-nested-object'

const input = '{"user":{"name":"Ada","roles":["admin","editor"]}}'
const expected = '{ "user": { "name": "Ada", "roles": ["admin", "editor"] } }\n'

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
