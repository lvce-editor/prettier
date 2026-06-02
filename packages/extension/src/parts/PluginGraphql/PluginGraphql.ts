import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.ts'

export const plugins = [PrettierModuleId.PluginGraphql]

export const parser = PrettierParserId.GraphQl
