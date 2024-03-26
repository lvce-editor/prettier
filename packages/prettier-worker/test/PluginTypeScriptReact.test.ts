import { expect, test } from '@jest/globals'
import * as PluginTypeScriptReact from '../src/parts/PluginTypeScriptReact/PluginTypeScriptReact.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginTypeScriptReact.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginTypeScriptReact.parser,
  })
}

test('formatTypeScriptReact', async () => {
  expect(await format(' let x: string = ""')).toBe(`let x: string = "";
`)
})
