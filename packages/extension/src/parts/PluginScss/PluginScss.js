// @ts-ignore
import parserCss from 'prettier/esm/parser-postcss.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'scss',
    plugins: [parserCss],
  })
}
