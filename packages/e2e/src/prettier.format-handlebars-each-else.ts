import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-handlebars-each-else'

const input =
  '<ul>{{#each users as |user|}}<li data-id={{user.id}}>{{user.name}}</li>{{else}}<li>No users</li>{{/each}}</ul>'
const expected = `<ul>{{#each users as |user|}}<li
      data-id={{user.id}}
    >{{user.name}}</li>{{else}}<li>No users</li>{{/each}}</ul>`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.hbs`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
