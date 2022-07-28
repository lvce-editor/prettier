import * as PluginGraphql from '../src/parts/PluginGraphql/PluginGraphql.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatGraphql = PluginGraphql.plugin(Prettier)

test('formatGraphql', () => {
  expect(formatGraphql('{ human(id: "1000") {name height}  }')).toBe(`{
  human(id: "1000") {
    name
    height
  }
}
`)
})
