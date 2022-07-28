import * as ExtensionHostFormattingProviderPrettier from './parts/ExtensionHost/ExtensionHostFormattingProviderPrettier.js'

export const activate = () => {
  vscode.registerFormattingProvider(ExtensionHostFormattingProviderPrettier)
}

export const deactivate = () => {}
