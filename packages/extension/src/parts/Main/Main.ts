import * as ExtensionHostFormattingProviderPrettier from '../ExtensionHost/ExtensionHostFormattingProviderPrettier.ts'
import * as LanguageIds from '../LanguageIds/LanguageIds.ts'

export const activate = () => {
  for (const languageId of LanguageIds.languageIds) {
    // @ts-ignore
    vscode.registerFormattingProvider({
      ...ExtensionHostFormattingProviderPrettier,
      languageId,
    })
  }
}

export const deactivate = () => {}
