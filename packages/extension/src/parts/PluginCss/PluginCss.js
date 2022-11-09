import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

export const plugins = [PrettierModuleId.ParserCss]

export const plugin = (prettier, plugins) => (text, options) => {
  return prettier.format(text, {
    parser: 'css',
    plugins,
  })
}
