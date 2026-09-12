import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.output-channel'

export const test: Test = async ({
  Editor,
  expect,
  FileSystem,
  Locator,
  Main,
  Output,
  Panel,
}) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/output-channel.js`
  await FileSystem.writeFile(uri, 'let  x=1')
  await Main.openUri(uri)
  await Editor.format()
  await expect(Locator('.Editor')).toHaveText('let x = 1;')

  await Panel.open('Output')
  await Output.selectChannel('prettier')
  await expect(Locator('[name="output"]')).toHaveValue('prettier')
  await expect(Locator('.OutputContent')).toContainText(`formatting ${uri}`)
  await expect(Locator('.OutputContent')).toContainText(
    'using bundled Prettier:',
  )
  await expect(Locator('.OutputContent')).toContainText('took ')
}
