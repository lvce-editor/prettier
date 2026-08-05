import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-elm-plugin'

export const test: Test = async ({
  Editor,
  expect,
  Locator,
  Main,
  Workspace,
}) => {
  const workspacePath = decodeURIComponent(
    new URL(
      '../fixtures/prettier-plugin-elm',
      import.meta.url,
    ).pathname.replace(/^\/remote/, ''),
  )
  await Workspace.setPath(workspacePath)
  await Main.openUri(`${workspacePath}/Main.elm`)

  await Editor.format()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText(
    'module Main exposing (main)import Html exposing (text)main =    Html.text "Hello"',
  )
}
