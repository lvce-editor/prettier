import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.js'

export const plugins = [PrettierModuleId.PluginPostCss]

export const parser = PrettierParserId.Scss
