import * as PluginCss from '../src/parts/PluginCss/PluginCss.ts'
import * as Prettier from '../src/parts/Prettier/Prettier.ts'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.ts'

const plugins = await PrettierModule.loadAll(PluginCss.plugins)
const format = (code) => {
  return Prettier.format(code, { plugins, parser: PluginCss.parser })
}

test('formatCss', async () => {
  expect(await format(' h1 { height: 10px }')).toBe(`h1 {
  height: 10px;
}
`)
})
