import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.js'

export const plugins = [
  PrettierModuleId.PluginTypeScript,
  PrettierModuleId.PluginEstree,
]

export const parser = PrettierParserId.TypeScript
