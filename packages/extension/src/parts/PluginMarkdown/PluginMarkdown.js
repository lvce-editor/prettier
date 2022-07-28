// @ts-ignore
import parserMarkdown from 'prettier/esm/parser-markdown.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'markdown',
    plugins: [parserMarkdown],
  })
}
