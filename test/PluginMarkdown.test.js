import * as PluginMarkdown from '../src/parts/PluginMarkdown/PluginMarkdown.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'

const formatMarkdown = PluginMarkdown.plugin(Prettier)

test('formatMarkdown', () => {
  expect(
    formatMarkdown(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`)
  ).toBe(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`)
})
