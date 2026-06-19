import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import { FormattingError } from '../FormattingError/FormattingError.ts'
import * as MinimizeEdit from '../MinimizeEdit/MinimizeEdit.ts'
import * as OutputChannel from '../OutputChannel/OutputChannel.ts'
import * as PluginModule from '../PluginModule/PluginModule.ts'
import * as Prettier from '../Prettier/Prettier.ts'
import * as PrettierConfig from '../PrettierConfig/PrettierConfig.ts'
import * as PrettierModule from '../PrettierModule/PrettierModule.ts'

type FormatFunction = (code: string) => Promise<string>

export const state: {
  readonly plugins: Record<string, FormatFunction>
} = {
  plugins: Object.create(null),
}

const getFormatFnSync = (uri: string): FormatFunction | undefined => {
  return state.plugins[uri]
}

const getFormatFnAsync = async (uri: string): Promise<FormatFunction> => {
  const { parser, plugins } = await PluginModule.loadPlugin(uri)
  const pluginInstances = await Promise.all(plugins.map(PrettierModule.load))
<<<<<<< HEAD
  state.plugins[uri] = (code, config) => {
=======
  state.plugins[uri] = (code: string): Promise<string> => {
>>>>>>> origin/main
    return Prettier.format(code, {
      ...config,
      plugins: pluginInstances,
      parser,
    })
  }
  return state.plugins[uri]
}

// TODO should use languageId to get right formatter instead of path
export const format = async (
  uri: string,
  content: string,
): Promise<OffsetBasedEdit> => {
  // console.log({ uri, content })
  OutputChannel.log(`formatting ${uri}`)
  const fn = getFormatFnSync(uri) || (await getFormatFnAsync(uri))
  try {
<<<<<<< HEAD
    const config = await PrettierConfig.resolveConfig(uri)
    const formattedText = await fn(content, config)
    if (formattedText === null) {
      return content
    }
=======
    const formattedText = await fn(content)
>>>>>>> origin/main
    const minimizedEdit = MinimizeEdit.minimizeEdit(content, formattedText)
    return minimizedEdit
  } catch (error) {
    console.error({ error })
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

// format('/test/index.ts', 'let x=2')
