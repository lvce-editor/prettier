import { expect, test } from '@jest/globals'
import * as PluginYaml from '../src/parts/PluginYaml/PluginYaml.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginYaml.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginYaml.parser,
  })
}

test('formatYaml', async () => {
  expect(await format('- x: 1')).toBe(`- x: 1
`)
})
