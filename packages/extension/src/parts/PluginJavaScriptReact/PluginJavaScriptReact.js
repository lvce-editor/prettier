// @ts-ignore
import parserBabel from 'prettier/esm/parser-babel.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'babel',
    plugins: [parserBabel],
  })
}
