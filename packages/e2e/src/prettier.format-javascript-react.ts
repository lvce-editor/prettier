import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-javascript-react'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.jsx`,
    'export const Button=({label})=><button className="primary">{label}</button>',
  )
  await Main.openUri(`${tmpDir}/test.jsx`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`export const Button = ({ label }) => (
  <button className="primary">{label}</button>
);
`)
}
