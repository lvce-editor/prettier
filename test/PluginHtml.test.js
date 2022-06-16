import * as PluginHtml from '../src/parts/PluginHtml/PluginHtml.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatHtml = PluginHtml.plugin(Prettier)

test('formatHtml', () => {
  expect(formatHtml(' <h1>hello world</h1>')).toBe(`<h1>hello world</h1>
`)
})
