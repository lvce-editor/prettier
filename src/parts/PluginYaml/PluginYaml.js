// @ts-ignore
import parserYaml from 'prettier/esm/parser-yaml.mjs'

export const plugin = (prettier) => (text, options) => {
  return prettier.format(text, {
    parser: 'yaml',
    plugins: [parserYaml],
  })
}
