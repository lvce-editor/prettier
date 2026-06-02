import { activate as activateExtensionApi, registerFormattingProvider } from '@lvce-editor/api'
import * as ExtensionHostFormattingProviderPrettier from '../ExtensionHost/ExtensionHostFormattingProviderPrettier.ts'
import * as LanguageIds from '../LanguageIds/LanguageIds.ts'

let isActivated = false

export const activate = async (): Promise<void> => {
  if (isActivated) {
    return
  }
  isActivated = true
  await activateExtensionApi()
  for (const languageId of LanguageIds.languageIds) {
    registerFormattingProvider({
      ...ExtensionHostFormattingProviderPrettier,
      id: `prettier.${languageId}`,
      languageId,
    })
  }
}

export const deactivate = () => {}
