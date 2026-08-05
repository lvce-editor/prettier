import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import { FormattingError } from '../FormattingError/FormattingError.ts'
import * as LocalPrettier from '../LocalPrettier/LocalPrettier.ts'
import * as MinimizeEdit from '../MinimizeEdit/MinimizeEdit.ts'
import * as OutputChannel from '../OutputChannel/OutputChannel.ts'
import * as PluginModule from '../PluginModule/PluginModule.ts'
import * as Prettier from '../Prettier/Prettier.ts'
import * as PrettierIgnore from '../PrettierIgnore/PrettierIgnore.ts'
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
  const { parser, plugins } = PluginModule.loadPlugin(uri)
  const pluginInstances = await Promise.all(plugins.map(PrettierModule.load))
  state.plugins[uri] = (code: string): Promise<string> => {
    return Prettier.format(code, {
      parser,
      plugins: pluginInstances,
    })
  }
  return state.plugins[uri]
}

// TODO should use languageId to get right formatter instead of path
export const format = async (
  uri: string,
  content: string,
): Promise<OffsetBasedEdit | undefined> => {
  if (await PrettierIgnore.isIgnored(uri)) {
    OutputChannel.log(`ignoring ${uri}`)
    return undefined
  }
  OutputChannel.log(`formatting ${uri}`)
  try {
    const localResult = await LocalPrettier.format(uri, content)
    let formattedText: string
    if (localResult.status === 'formatted') {
      OutputChannel.log(
        `using local Prettier ${localResult.version} from ${localResult.path}`,
      )
      const { formattedText: localFormattedText } = localResult
      formattedText = localFormattedText
    } else if (localResult.status === 'format-error') {
      throw new Error(localResult.message)
    } else {
      OutputChannel.log(
        `using bundled Prettier: local Prettier unavailable (${localResult.reason})`,
      )
      const fn = getFormatFnSync(uri) || (await getFormatFnAsync(uri))
      formattedText = await fn(content)
    }
    const minimizedEdit = MinimizeEdit.minimizeEdit(content, formattedText)
    return minimizedEdit
  } catch (error) {
    console.error({ error })
    const enhancedError = new FormattingError(
      `Failed to format ${uri}: ${error}`,
    )
    throw enhancedError
  }
}
