import * as PluginTypeScript from '../src/parts/PluginTypeScript/PluginTypeScript.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginTypeScript.plugins)
const format = PluginTypeScript.plugin(Prettier, plugins)

test('formatTypeScript', () => {
  expect(format(' let x: string = ""')).toBe(`let x: string = "";
`)
})
