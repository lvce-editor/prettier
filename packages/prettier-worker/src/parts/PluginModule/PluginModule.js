import * as PluginCss from '../PluginCss/PluginCss.js'
import * as PluginGraphql from '../PluginGraphql/PluginGraphql.js'
import * as PluginHtml from '../PluginHtml/PluginHtml.js'
import * as PluginJavaScript from '../PluginJavaScript/PluginJavaScript.js'
import * as PluginJavaScriptReact from '../PluginJavaScriptReact/PluginJavaScriptReact.js'
import * as PluginJson from '../PluginJson/PluginJson.js'
import * as PluginJsonc from '../PluginJsonc/PluginJsonc.js'
import * as PluginLess from '../PluginLess/PluginLess.js'
import * as PluginMarkdown from '../PluginMarkdown/PluginMarkdown.js'
import * as PluginScss from '../PluginScss/PluginScss.js'
import * as PluginTypeScript from '../PluginTypeScript/PluginTypeScript.js'
import * as PluginTypeScriptReact from '../PluginTypeScriptReact/PluginTypeScriptReact.js'
import * as PluginVue from '../PluginVue/PluginVue.js'
import * as PluginYaml from '../PluginYaml/PluginYaml.js'

const extName = (uri) => {
  return uri.slice(uri.lastIndexOf('.'))
}

export const loadPlugin = (uri) => {
  const extension = extName(uri)
  switch (extension) {
    case '.css':
      return PluginCss
    case '.gql':
      return PluginGraphql
    case '.html':
      return PluginHtml
    case '.js':
    case '.mjs':
      return PluginJavaScript
    case '.jsx':
      return PluginJavaScriptReact
    case '.json':
      return PluginJson
    case '.jsonc':
      return PluginJsonc
    case '.less':
      return PluginLess
    case '.md':
      return PluginMarkdown
    case '.scss':
      return PluginScss
    case '.ts':
      return PluginTypeScript
    case '.tsx':
      return PluginTypeScriptReact
    case '.vue':
      return PluginVue
    case '.yml':
      return PluginYaml
    default:
      throw new Error(`cannot format ${uri}`)
  }
}
