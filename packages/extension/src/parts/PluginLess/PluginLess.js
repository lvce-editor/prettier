import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

export const plugins = [PrettierModuleId.ParserPostCss]

export const plugin = (prettier, plugins) => (text, options) => {
  return prettier.format(text, {
    parser: 'less',
    plugins,
  })
}
