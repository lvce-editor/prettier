import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.js'

export const plugins = [
  PrettierModuleId.PluginBabel,
  PrettierModuleId.PluginEstree,
]

export const parser = PrettierParserId.Babel
