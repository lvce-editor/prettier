import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

export const plugins = [PrettierModuleId.ParserHtml]

export const plugin = (prettier, plugins) => (text, options) => {
  return prettier.format(text, {
    parser: 'html',
    plugins,
  })
}
