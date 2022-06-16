// @ts-ignore
import parserAngular from 'prettier/esm/parser-angular.mjs'
// @ts-ignore
import parserHtml from 'prettier/esm/parser-html.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'angular',
    plugins: [parserHtml, parserAngular],
  })
}
