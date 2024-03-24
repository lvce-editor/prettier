import * as PluginHtml from '../src/parts/PluginHtml/PluginHtml.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'
import { test, expect } from '@jest/globals'

const plugins = await PrettierModule.loadAll(PluginHtml.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginHtml.parser,
  })
}

test('formatHtml', async () => {
  expect(await format(' <h1>hello world</h1>')).toBe(`<h1>hello world</h1>
`)
})
