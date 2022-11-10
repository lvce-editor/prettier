import * as PluginModule from '../PluginModule/PluginModule.js'
import * as Prettier from '../Prettier/Prettier.js'
import * as PrettierModule from '../PrettierModule/PrettierModule.js'

export const state = {
  plugins: Object.create(null),
}

const getFormatFnSync = (uri) => {
  return state.plugins[uri]
}

const getFormatFnAsync = async (uri) => {
  const { plugin, plugins } = await PluginModule.loadPlugin(uri)
  const pluginInstances = await Promise.all(plugins.map(PrettierModule.load))
  state.plugins[uri] = plugin(Prettier, pluginInstances)
  return state.plugins[uri]
}

class FormattingError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FormattingError'
    this.code = 'E_FORMATTING_FAILED'
  }
}

// TODO should use languageId to get right formatter instead of path
export const format = async (uri, content) => {
  const fn = getFormatFnSync(uri) || (await getFormatFnAsync(uri))
  try {
    const formattedText = fn(content)
    if (formattedText === null) {
      return content
    }
    return formattedText
  } catch (error) {
    const enhancedError = new FormattingError(
      `Failed to format ${uri}: ${error}`
    )
    throw enhancedError
    // if (error instanceof SyntaxError) {
    //   return {
    //     error: error.toString(),
    //   }
    // }
  }
}
