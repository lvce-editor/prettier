import * as PluginJsonc from '../src/parts/PluginJsonc/PluginJsonc.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'
import { test, expect } from '@jest/globals'

const plugins = await PrettierModule.loadAll(PluginJsonc.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginJsonc.parser,
  })
}

test('formatJson', async () => {
  expect(await format(' {}')).toBe(`{}
`)
})
