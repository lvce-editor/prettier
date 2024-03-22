import * as PluginJsonc from '../src/parts/PluginJsonc/PluginJsonc.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginJsonc.plugins)
const format = (code) => {
  return Prettier.format(code, {
    plugins,
    parser: PluginJsonc.parser,
  })
}

test('formatJsonc', async () => {
  expect(await format(' {}')).toBe(`{}
`)
})
