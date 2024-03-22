import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.ts'

export const plugins = [
  PrettierModuleId.PluginTypeScript,
  PrettierModuleId.PluginEstree,
]

export const parser = PrettierParserId.TypeScript
