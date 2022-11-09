import * as PluginMarkdown from '../src/parts/PluginMarkdown/PluginMarkdown.js'
import * as Prettier from '../src/parts/Prettier/Prettier.js'
import * as PrettierModule from '../src/parts/PrettierModule/PrettierModule.js'

const plugins = await PrettierModule.loadAll(PluginMarkdown.plugins)
const format = PluginMarkdown.plugin(Prettier, plugins)

test('formatMarkdown', () => {
  expect(
    format(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`)
  ).toBe(`\`\`\`html
  <h1>hello world</h1>
\`\`\`
`)
})
