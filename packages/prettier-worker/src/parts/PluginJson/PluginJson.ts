import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.ts'

export const plugins = [
  PrettierModuleId.PluginBabel,
  PrettierModuleId.PluginEstree,
]

export const parser = PrettierParserId.Json
