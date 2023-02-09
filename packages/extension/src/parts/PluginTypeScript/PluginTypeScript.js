import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.js'

export const plugins = [PrettierModuleId.PluginTypeScript]

export const parser = PrettierParserId.TypeScript
