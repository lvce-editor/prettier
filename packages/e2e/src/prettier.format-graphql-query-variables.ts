import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-query-variables'

const input = 'query User($id:ID!){user(id:$id){id name email}}'
const expected = `query User($id: ID!) {
  user(id: $id) {
    id
    name
    email
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
