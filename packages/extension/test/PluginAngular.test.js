import * as PluginAngular from '../src/parts/PluginAngular/PluginAngular.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginAngular.plugins)
const format = PluginAngular.plugin(Prettier, plugins)

test('formatAngular', () => {
  expect(format(' <h1>hello world</h1>')).toBe(`<h1>hello world</h1>
`)
})
