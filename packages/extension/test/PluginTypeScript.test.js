import * as PluginTypeScript from '../src/parts/PluginTypeScript/PluginTypeScript.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginTypeScript.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginTypeScript.parser,
  })
}

test('formatTypeScript', async () => {
  expect(await format(' let x: string = ""')).toBe(`let x: string = "";
`)
})
