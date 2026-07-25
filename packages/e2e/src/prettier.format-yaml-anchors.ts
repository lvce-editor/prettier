import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-yaml-anchors'

const input = `defaults: &defaults
 color: red
 enabled: true
production:
 <<: *defaults
 enabled: false`
const expected = `defaults: &defaults
  color: red
  enabled: true
production:
  <<: *defaults
  enabled: false
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.yml`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
