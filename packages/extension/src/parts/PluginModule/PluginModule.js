import path from 'node:path'

export const loadPlugin = (uri) => {
  const extension = path.extname(uri)
  switch (extension) {
    case '.css':
      return import('../PluginCss/PluginCss.js')
    case '.gql':
      return import('../PluginGraphql/PluginGraphql.js')
    case '.html':
      return import('../PluginHtml/PluginHtml.js')
    case '.js':
      return import('../PluginJavaScript/PluginJavaScript.js')
    case '.jsx':
      return import('../PluginJavaScriptReact/PluginJavaScriptReact.js')
    case '.json':
      return import('../PluginJson/PluginJson.js')
    case '.jsonc':
      return import('../PluginJsonc/PluginJsonc.js')
    case '.less':
      return import('../PluginLess/PluginLess.js')
    case '.md':
      return import('../PluginMarkdown/PluginMarkdown.js')
    case '.scss':
      return import('../PluginScss/PluginScss.js')
    case '.ts':
      return import('../PluginTypeScript/PluginTypeScript.js')
    case '.tsx':
      return import('../PluginTypeScriptReact/PluginTypeScriptReact.js')
    case '.vue':
      return import('../PluginVue/PluginVue.js')
    case '.yml':
      return import('../PluginYaml/PluginYaml.js')
    default:
      throw new Error(`cannot format ${uri}`)
  }
}
