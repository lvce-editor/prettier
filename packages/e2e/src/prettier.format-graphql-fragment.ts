import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-fragment'

const input = 'fragment UserFields on User{id name profile{avatarUrl}}'
const expected = `fragment UserFields on User {
  id
  name
  profile {
    avatarUrl
  }
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.gql`, input)
  await Main.openUri(`${tmpDir}/test.gql`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(expected)
}
