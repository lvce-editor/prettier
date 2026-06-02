import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'
import * as ExtensionHostFormattingProviderPrettier from '../ExtensionHost/ExtensionHostFormattingProviderPrettier.ts'
import * as LanguageIds from '../LanguageIds/LanguageIds.ts'

let isActivated = false

export const activate = async (): Promise<void> => {
  if (isActivated) {
    return
  }
  console.info('builtin.prettier activating isolated extension')
  isActivated = true
  await activateExtensionApi()
  for (const languageId of LanguageIds.languageIds) {
    console.info(`builtin.prettier registering formatter ${languageId}`)
    registerFormattingProvider({
      ...ExtensionHostFormattingProviderPrettier,
      id: `prettier.${languageId}`,
      languageId,
    })
  }
}

export const deactivate = () => {}
