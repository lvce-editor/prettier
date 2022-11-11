import * as PluginCss from '../src/parts/PluginCss/PluginCss.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

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
