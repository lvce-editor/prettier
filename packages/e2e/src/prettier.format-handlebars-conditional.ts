import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-handlebars-conditional'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.hbs`,
    `<main>
{{#if active}}
<span> {{ label }} </span>
{{else}}
<span> Off </span>
{{/if}}
</main>`,
  )
  await Main.openUri(`${tmpDir}/test.hbs`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`<main>
  {{#if active}}
    <span> {{label}} </span>
  {{else}}
    <span> Off </span>
  {{/if}}
</main>`)
}
