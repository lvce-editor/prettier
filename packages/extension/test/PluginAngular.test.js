import * as PluginAngular from '../src/parts/PluginAngular/PluginAngular.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatAngular = PluginAngular.plugin(Prettier)

test('formatAngular', () => {
  expect(formatAngular(' <h1>hello world</h1>')).toBe(`<h1>hello world</h1>
`)
})
