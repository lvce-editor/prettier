import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-yaml-nested-values'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.yml`,
    'user:\n name: Ada\n roles: [admin,editor]',
  )
  await Main.openUri(`${tmpDir}/test.yml`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`user:
  name: Ada
  roles: [admin, editor]
`)
}
