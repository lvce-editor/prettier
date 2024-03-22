import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.js'

export const plugins = [
  PrettierModuleId.PluginHtml,
  PrettierModuleId.PluginAngular,
]

export const parser = PrettierParserId.Angular
