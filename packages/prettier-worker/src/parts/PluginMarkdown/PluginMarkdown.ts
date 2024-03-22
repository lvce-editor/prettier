import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'
import * as PrettierParserId from '../PrettierParserId/PrettierParserId.ts'

export const plugins = [PrettierModuleId.PluginMarkdown]

export const parser = PrettierParserId.Markdown
