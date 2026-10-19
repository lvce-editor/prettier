import {
  activate as activateExtensionApi,
  registerFormattingProvider,
} from '@lvce-editor/api'
import * as ExtensionHostFormattingProviderPrettier from '../ExtensionHost/ExtensionHostFormattingProviderPrettier.ts'
import * as LanguageIds from '../LanguageIds/LanguageIds.ts'
import * as LocalPrettier from '../LocalPrettier/LocalPrettier.ts'
import * as ResolvePackageConfig from '../ResolvePackageConfig/ResolvePackageConfig.ts'

const state = {
  isActivated: false,
  providers: [] as ReturnType<typeof registerFormattingProvider>[],
}

export const activate = async (): Promise<void> => {
  if (state.isActivated) {
    return
  }
  state.isActivated = true
  await activateExtensionApi()
  for (const languageId of LanguageIds.languageIds) {
    state.providers.push(
      registerFormattingProvider({
        ...ExtensionHostFormattingProviderPrettier,
        id: `prettier.${languageId}`,
        languageId,
      }),
    )
  }
}

export const deactivate = async (): Promise<void> => {
  await Promise.all([LocalPrettier.dispose(), ResolvePackageConfig.dispose()])
  for (const provider of state.providers) provider.dispose()
  state.providers = []
  state.isActivated = false
}
