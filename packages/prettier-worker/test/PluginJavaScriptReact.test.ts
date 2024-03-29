import { expect, test } from '@jest/globals'
import * as PluginJavaScriptReact from '../src/parts/PluginJavaScriptReact/PluginJavaScriptReact.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginJavaScriptReact.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginJavaScriptReact.parser,
  })
}

test('formatJavaScriptReact', async () => {
  expect(await format(' let x = ""')).toBe(`let x = "";
`)
})
