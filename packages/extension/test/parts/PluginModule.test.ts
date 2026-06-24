import { expect, test } from '@jest/globals'
import * as PluginCss from '../../src/parts/PluginCss/PluginCss.ts'
import * as PluginGraphql from '../../src/parts/PluginGraphql/PluginGraphql.ts'
import * as PluginHtml from '../../src/parts/PluginHtml/PluginHtml.ts'
import * as PluginJavaScript from '../../src/parts/PluginJavaScript/PluginJavaScript.ts'
import * as PluginJavaScriptReact from '../../src/parts/PluginJavaScriptReact/PluginJavaScriptReact.ts'
import * as PluginJson from '../../src/parts/PluginJson/PluginJson.ts'
import * as PluginJsonc from '../../src/parts/PluginJsonc/PluginJsonc.ts'
import * as PluginLess from '../../src/parts/PluginLess/PluginLess.ts'
import * as PluginMarkdown from '../../src/parts/PluginMarkdown/PluginMarkdown.ts'
import * as PluginModule from '../../src/parts/PluginModule/PluginModule.ts'
import * as PluginScss from '../../src/parts/PluginScss/PluginScss.ts'
import * as PluginTypeScript from '../../src/parts/PluginTypeScript/PluginTypeScript.ts'
import * as PluginTypeScriptReact from '../../src/parts/PluginTypeScriptReact/PluginTypeScriptReact.ts'
import * as PluginVue from '../../src/parts/PluginVue/PluginVue.ts'
import * as PluginYaml from '../../src/parts/PluginYaml/PluginYaml.ts'

test.each([
  ['/test/style.css', PluginCss],
  ['/test/schema.gql', PluginGraphql],
  ['/test/index.html', PluginHtml],
  ['/test/index.js', PluginJavaScript],
  ['/test/index.mjs', PluginJavaScript],
  ['/test/index.json', PluginJson],
  ['/test/index.jsonc', PluginJsonc],
  ['/test/view.jsx', PluginJavaScriptReact],
  ['/test/style.less', PluginLess],
  ['/test/readme.md', PluginMarkdown],
  ['/test/style.scss', PluginScss],
  ['/test/view.tsx', PluginTypeScriptReact],
  ['/test/index.ts', PluginTypeScript],
  ['/test/app.vue', PluginVue],
  ['/test/config.yml', PluginYaml],
])('loadPlugin(%s) returns the matching plugin module', (uri, plugin) => {
  expect(PluginModule.loadPlugin(uri)).toBe(plugin)
})

test('loadPlugin throws for unsupported extensions', () => {
  expect(() => PluginModule.loadPlugin('/test/file.txt')).toThrow(
    'cannot format /test/file.txt',
  )
})
