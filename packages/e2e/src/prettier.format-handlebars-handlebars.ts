import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-handlebars-handlebars'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
}) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.handlebars`,
    `<section>
{{#each users as |user|}}
<UserCard @name={{ user.name }} />
{{/each}}
</section>`,
  )
  await Main.openUri(`${tmpDir}/test.handlebars`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(`<section>
  {{#each users as |user|}}
    <UserCard @name={{user.name}} />
  {{/each}}
</section>`)
}
