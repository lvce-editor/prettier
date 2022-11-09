import * as PluginYaml from '../src/parts/PluginYaml/PluginYaml.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginYaml.plugins)
const format = PluginYaml.plugin(Prettier, plugins)

test('formatYaml', () => {
  expect(format('- x: 1')).toBe(`- x: 1
`)
})
