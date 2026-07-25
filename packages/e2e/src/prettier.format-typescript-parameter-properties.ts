import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'prettier.format-typescript-parameter-properties'

const input =
  'class User{constructor(public readonly name:string,private age:number){}getAge():number{return this.age}}'
const expected = `class User {
  constructor(
    public readonly name: string,
    private age: number,
  ) {}
  getAge(): number {
    return this.age;
  }
}
`

export const test: Test = async ({ Editor, FileSystem, Main }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/test.ts`
  await FileSystem.writeFile(uri, input)
  await Main.openUri(uri)

  await Editor.format()

  await Editor.shouldHaveText(expected)
}
