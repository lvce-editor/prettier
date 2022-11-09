import * as PluginScss from '../src/parts/PluginScss/PluginScss.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginScss.plugins)
const format = PluginScss.plugin(Prettier, plugins)

test('formatScss', () => {
  expect(format(' h1 { height: 10px }')).toBe(`h1 {
  height: 10px;
}
`)
})
