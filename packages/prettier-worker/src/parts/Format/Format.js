import { FormattingError } from '../FormattingError/FormattingError.js'
import * as MinimizeEdit from '../MinimizeEdit/MinimizeEdit.js'
import * as PluginModule from '../PluginModule/PluginModule.js'
import * as Prettier from '../Prettier/Prettier.js'
import * as OutputChannel from '../OutputChannel/OutputChannel.js'
import * as PrettierModule from '../PrettierModule/PrettierModule.js'

export const state = {
  plugins: Object.create(null),
}

const getFormatFnSync = (uri) => {
  return state.plugins[uri]
}

const getFormatFnAsync = async (uri) => {
  const { parser, plugins } = await PluginModule.loadPlugin(uri)
  const pluginInstances = await Promise.all(plugins.map(PrettierModule.load))
  state.plugins[uri] = (code) => {
    return Prettier.format(code, {
      plugins: pluginInstances,
      parser,
    })
  }
  return state.plugins[uri]
}

// TODO should use languageId to get right formatter instead of path
export const format = async (uri, content) => {
  // console.log({ uri, content })
  OutputChannel.log(`formatting ${uri}`)
  const fn = getFormatFnSync(uri) || (await getFormatFnAsync(uri))
  try {
    const s = performance.now()
    const formattedText = await fn(content)
    const e = performance.now()
    const diff = e - s
    console.log(`actually took ${diff}ms`)
    if (formattedText === null) {
      return content
    }
    const minimizedEdit = MinimizeEdit.minimizeEdit(content, formattedText)
    return minimizedEdit
  } catch (error) {
    console.log({ error })
    const enhancedError = new FormattingError(
      `Failed to format ${uri}: ${error}`,
    )
    throw enhancedError
    // if (error instanceof SyntaxError) {
    //   return {
    //     error: error.toString(),
    //   }
    // }
  }
}

// format('/test/index.js', 'let x=2')
