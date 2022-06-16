import * as PluginScss from '../src/parts/PluginScss/PluginScss.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatScss = PluginScss.plugin(Prettier)

test('formatScss', () => {
  expect(formatScss(' h1 { height: 10px }')).toBe(`h1 {
  height: 10px;
}
`)
})
