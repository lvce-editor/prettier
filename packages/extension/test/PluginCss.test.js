import * as PluginCss from '../src/parts/PluginCss/PluginCss.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatCss = PluginCss.plugin(Prettier)

test('formatCss', () => {
  expect(formatCss(' h1 { height: 10px }')).toBe(`h1 {
  height: 10px;
}
`)
})
