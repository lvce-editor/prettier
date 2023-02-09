import * as PrettierModule from '../PrettierModule/PrettierModule.js'
import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

const Prettier = await PrettierModule.load(PrettierModuleId.Standalone)

export const format = Prettier.format

export const formatWithCursor = Prettier.formatWithCursor
