import * as PluginLess from '../src/parts/PluginLess/PluginLess.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatLess = PluginLess.plugin(Prettier)

test('formatLess', () => {
  expect(formatLess(' h1 { height: 10px }')).toBe(`h1 {
  height: 10px;
}
`)
})
