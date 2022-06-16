// @ts-ignore
import parserHtml from 'prettier/esm/parser-html.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'html',
    plugins: [parserHtml],
  })
}
