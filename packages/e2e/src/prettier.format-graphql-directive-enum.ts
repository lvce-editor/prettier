import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-graphql-directive-enum'

const input = `directive @auth(role:Role!) on FIELD_DEFINITION
enum Role{ADMIN EDITOR VIEWER}
type Query{secret:String @auth(role:ADMIN)}`
const expected = `directive @auth(role: Role!) on FIELD_DEFINITION
enum Role {
  ADMIN
  EDITOR
  VIEWER
}
type Query {
  secret: String @auth(role: ADMIN)
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
