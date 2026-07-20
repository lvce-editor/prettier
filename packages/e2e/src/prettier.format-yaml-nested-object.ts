import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-yaml-nested-object'

const input = 'server:\n host: localhost\n ports: [3000,3001]\n enabled: true'
const expected = `server:
  host: localhost
  ports: [3000, 3001]
  enabled: true
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.yml`, input)
  await Main.openUri(`${tmpDir}/test.yml`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
