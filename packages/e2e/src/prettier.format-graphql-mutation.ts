import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-mutation'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.gql`,
    'mutation UpdateUser($id:ID!,$name:String!){updateUser(id:$id,name:$name){id name}}',
  )
  await Main.openUri(`${tmpDir}/test.gql`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`mutation UpdateUser($id: ID!, $name: String!) {
  updateUser(id: $id, name: $name) {
    id
    name
  }
}
`)
}
