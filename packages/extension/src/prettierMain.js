import * as ExtensionHostFormattingProviderPrettier from './parts/ExtensionHost/ExtensionHostFormattingProviderPrettier.js'

const languageIds = ['css', 'html', 'json', 'javascript', 'typescript']

export const activate = () => {
  for (const languageId of languageIds) {
    // @ts-ignore
    vscode.registerFormattingProvider({
      ...ExtensionHostFormattingProviderPrettier,
      languageId,
    })
  }
}

export const deactivate = () => {}
