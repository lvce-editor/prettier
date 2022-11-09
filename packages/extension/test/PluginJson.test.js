import * as PluginJsonc from '../src/parts/PluginJsonc/PluginJsonc.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginJsonc.plugins)
const formatJson = PluginJsonc.plugin(Prettier, plugins)

test('formatJson', () => {
  expect(formatJson(' {}')).toBe(`{}
`)
})
