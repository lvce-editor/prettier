import { getPreference } from '@lvce-editor/api'
import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import * as FormattingWorker from '../FormattingWorker/FormattingWorker.ts'
import * as LocalPrettier from '../LocalPrettier/LocalPrettier.ts'
import * as MinimizeEdit from '../MinimizeEdit/MinimizeEdit.ts'
import * as OutputChannel from '../OutputChannel/OutputChannel.ts'
import * as PrettierIgnore from '../PrettierIgnore/PrettierIgnore.ts'
import * as ResolvePackageConfig from '../ResolvePackageConfig/ResolvePackageConfig.ts'

// TODO should use languageId to get right formatter instead of path
export const format = async (
  uri: string,
  content: string,
): Promise<OffsetBasedEdit | undefined> => {
  if (await PrettierIgnore.isIgnored(uri)) {
    await OutputChannel.log(`ignoring ${uri}`)
    return undefined
  }
  await OutputChannel.log(`formatting ${uri}`)
  try {
    let useFileWatcher = false
    try {
      useFileWatcher =
        (await getPreference('prettier.useFileWatcher')) !== false
    } catch {
      // Older hosts still format with fresh configuration.
    }
    if (!useFileWatcher) {
      await Promise.all([
        LocalPrettier.dispose(),
        ResolvePackageConfig.dispose(),
      ])
    }
    const localResult = await LocalPrettier.format(uri, content, useFileWatcher)
    let formattedText: string
    if (localResult.status === 'formatted') {
      await OutputChannel.log(
        `using local Prettier ${localResult.version} from ${localResult.path}`,
      )
      const { formattedText: localFormattedText } = localResult
      formattedText = localFormattedText
    } else if (localResult.status === 'format-error') {
      throw new Error(localResult.message)
    } else {
      await OutputChannel.log(
        `using bundled Prettier: local Prettier unavailable (${localResult.reason})`,
      )
      formattedText = await FormattingWorker.format(
        uri,
        content,
        await ResolvePackageConfig.resolvePackageConfig(uri, useFileWatcher),
      )
    }
    const minimizedEdit = MinimizeEdit.minimizeEdit(content, formattedText)
    return minimizedEdit
  } catch (error) {
    await OutputChannel.log(`Failed to format ${uri}: ${error}`)
    return undefined
  }
}
