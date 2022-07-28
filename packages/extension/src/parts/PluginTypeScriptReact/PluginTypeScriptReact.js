// @ts-ignore
import parserTypeScript from 'prettier/esm/parser-typescript.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'typescript',
    plugins: [parserTypeScript],
  })
}
