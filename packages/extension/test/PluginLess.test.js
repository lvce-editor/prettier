import * as PluginLess from '../src/parts/PluginLess/PluginLess.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginLess.plugins)
const format = PluginLess.plugin(Prettier, plugins)

test('formatLess', () => {
  expect(format(' h1 { height: 10px }')).toBe(`h1 {
  height: 10px;
}
`)
})
