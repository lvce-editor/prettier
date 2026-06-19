import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-handlebars-hbs'

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
    `${tmpDir}/test.hbs`,
    `<main>
{{#if user}}
<p>{{ user.name }}</p>
{{else}}
<p>Guest</p>
{{/if}}
</main>`,
  )
  await Main.openUri(`${tmpDir}/test.hbs`)

  // act
  await Editor.format()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    '<main>  {{#if user}}    <p>{{user.name}}</p>  {{else}}    <p>Guest</p>  {{/if}}</main>',
  )
}
