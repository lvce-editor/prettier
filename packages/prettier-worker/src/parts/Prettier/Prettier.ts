import * as PrettierModule from '../PrettierModule/PrettierModule.ts'
import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'

const Prettier = await PrettierModule.load(PrettierModuleId.Standalone)

export const format = Prettier.format

export const formatWithCursor = Prettier.formatWithCursor
