// @ts-ignore
import parserGraphql from 'prettier/esm/parser-graphql.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'graphql',
    plugins: [parserGraphql],
  })
}
