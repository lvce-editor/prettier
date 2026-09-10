import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import { FormattingError } from '../FormattingError/FormattingError.ts'
import * as FormattingWorker from '../FormattingWorker/FormattingWorker.ts'
import * as LocalPrettier from '../LocalPrettier/LocalPrettier.ts'
import * as MinimizeEdit from '../MinimizeEdit/MinimizeEdit.ts'
import * as OutputChannel from '../OutputChannel/OutputChannel.ts'
import * as PrettierIgnore from '../PrettierIgnore/PrettierIgnore.ts'
import { resolvePackageConfig } from '../ResolvePackageConfig/ResolvePackageConfig.ts'

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
      formattedText = await FormattingWorker.format(
        uri,
        content,
        await resolvePackageConfig(uri),
      )
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
