import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-interface'

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.ts`,
    'interface User{id:number;name:string}const user:User={id:1,name:"Ada"}',
  )
  await Main.openUri(`${tmpDir}/test.ts`)

  // act
  await Editor.format()

  // assert
  await Editor.shouldHaveText(`interface User {
  id: number;
  name: string;
}
const user: User = { id: 1, name: "Ada" };
`)
}
