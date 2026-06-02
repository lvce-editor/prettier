import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.ts'

export const plugins = [
  PrettierModuleId.PluginHtml,
  PrettierModuleId.PluginAngular,
]

export const parser = PrettierParserId.Angular
