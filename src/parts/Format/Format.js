import path from 'node:path'
import VError from 'verror'
import * as Prettier from '../Prettier/Prettier.js'

// see available parsers https://prettier.io/docs/en/options.html#parser
// const PARSER_BABEL = 'babel'
// const PARSER_BABEL_FLOW = 'babel-flow'
// const PARSER_BABEL_TS = 'babel-ts'
// const PARSER_FLOW = 'flow'
// const PARSER_TYPESCRIPT = 'typescript'
// const PARSER_ESPREE = 'espree'
// const PARSER_MERIYAH = 'meriyah'
// const PARSER_CSS = 'css'
// const PARSER_SCSS = 'scss'
// const PARSER_LESS = 'less'
// const PARSER_JSON = 'json'
// const PARSER_JSON5 = 'json5'
// const PARSER_JSON_STRINGIFY = 'json-stringify'
// const PARSER_GRAPHQL = 'graphql'
// const PARSER_MARKDOWN = 'markdown'
// const PARSER_MDX = 'mdx'
// const PARSER_HTML = 'html'
// const PARSER_VUE = 'vue'
// const PARSER_ANGULAR = 'angular'
// const PARSER_LWC = 'lwc'
// const PARSER_YAML = 'yaml'

// const getParser = (path) => {
//   if (path.endsWith('.html')) {
//     return PARSER_HTML
//   }
//   if (path.endsWith('.css')) {
//     return PARSER_CSS
//   }
//   if (path.endsWith('.json')) {
//     return PARSER_JSON
//   }
//   if (path.endsWith('.js')) {
//     return PARSER_BABEL
//   }
//   if(path.endsWith('.ts')){
//     return PARSER_BABEL_TS
//   }
//   return ''
// }

export const state = {
  plugins: Object.create(null),
}

const loadPlugin = (uri) => {
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

const getFormatFnSync = (uri) => {
  return state.plugins[uri]
}

const getFormatFnAsync = async (uri) => {
  const { plugin } = await loadPlugin(uri)
  state.plugins[uri] = plugin(Prettier)
  return state.plugins[uri]
}

// TODO should use languageId to get right formatter instead of path
export const format = async (uri, content) => {
  const fn = getFormatFnSync(uri) || (await getFormatFnAsync(uri))
  try {
    const formattedText = fn(content)
    return formattedText
  } catch (error) {
    const enhancedError = new VError(error, `Failed to format ${uri}`)
    throw enhancedError
    // if (error instanceof SyntaxError) {
    //   return {
    //     error: error.toString(),
    //   }
    // }
    // console.warn(new VError(error, `failed to format ${path}`))
    // return {
    //   error: error.toString(),
    // }
  }
}
