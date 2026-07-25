import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-schema'

const input =
  'type User{id:ID! name:String! posts(limit:Int=10):[Post!]!}type Post{id:ID! title:String! author:User!}'
const expected = `type User {
  id: ID!
  name: String!
  posts(limit: Int = 10): [Post!]!
}
type Post {
  id: ID!
  title: String!
  author: User!
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.gql`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
