import * as PluginCss from '../PluginCss/PluginCss.ts'
import * as PluginGraphql from '../PluginGraphql/PluginGraphql.ts'
import * as PluginHtml from '../PluginHtml/PluginHtml.ts'
import * as PluginJavaScript from '../PluginJavaScript/PluginJavaScript.ts'
import * as PluginJavaScriptReact from '../PluginJavaScriptReact/PluginJavaScriptReact.ts'
import * as PluginJson from '../PluginJson/PluginJson.ts'
import * as PluginJsonc from '../PluginJsonc/PluginJsonc.ts'
import * as PluginLess from '../PluginLess/PluginLess.ts'
import * as PluginMarkdown from '../PluginMarkdown/PluginMarkdown.ts'
import * as PluginScss from '../PluginScss/PluginScss.ts'
import * as PluginTypeScript from '../PluginTypeScript/PluginTypeScript.ts'
import * as PluginTypeScriptReact from '../PluginTypeScriptReact/PluginTypeScriptReact.ts'
import * as PluginVue from '../PluginVue/PluginVue.ts'
import * as FileExtension from '../FileExtension/FileExtension.ts'
import * as PluginYaml from '../PluginYaml/PluginYaml.ts'

const extName = (uri) => {
  return uri.slice(uri.lastIndexOf('.'))
}

export const loadPlugin = (uri) => {
  const extension = extName(uri)
  switch (extension) {
    case FileExtension.Css:
      return PluginCss
    case FileExtension.GraphQl:
      return PluginGraphql
    case FileExtension.Html:
      return PluginHtml
    case FileExtension.JavaScript:
    case FileExtension.JavascriptModule:
      return PluginJavaScript
    case FileExtension.Jsx:
      return PluginJavaScriptReact
    case FileExtension.Json:
      return PluginJson
    case FileExtension.Jsonc:
      return PluginJsonc
    case FileExtension.Less:
      return PluginLess
    case FileExtension.Markdown:
      return PluginMarkdown
    case FileExtension.Scss:
      return PluginScss
    case FileExtension.Typescript:
      return PluginTypeScript
    case FileExtension.Tsx:
      return PluginTypeScriptReact
    case FileExtension.Vue:
      return PluginVue
    case FileExtension.Yaml:
      return PluginYaml
    default:
      throw new Error(`cannot format ${uri}`)
  }
}
