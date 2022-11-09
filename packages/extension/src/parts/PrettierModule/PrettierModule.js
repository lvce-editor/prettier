import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

const loadInternal = (moduleId) => {
  switch (moduleId) {
    case PrettierModuleId.ParserAngular:
      return import('../../../third_party/prettier/esm/parser-angular.mjs')
    case PrettierModuleId.ParserBabel:
      return import('../../../third_party/prettier/esm/parser-babel.mjs')
    case PrettierModuleId.ParserCss:
      return import('../../../third_party/prettier/esm/parser-postcss.mjs')
    case PrettierModuleId.ParserGraphql:
      return import('../../../third_party/prettier/esm/parser-graphql.mjs')
    case PrettierModuleId.ParserHtml:
      return import('../../../third_party/prettier/esm/parser-html.mjs')
    case PrettierModuleId.ParserJavaScript:
      return import('../../../third_party/prettier/esm/parser-babel.mjs')
    case PrettierModuleId.ParserMarkdown:
      return import('../../../third_party/prettier/esm/parser-markdown.mjs')
    case PrettierModuleId.ParserPostCss:
      return import('../../../third_party/prettier/esm/parser-postcss.mjs')
    case PrettierModuleId.ParserTypeScript:
      return import('../../../third_party/prettier/esm/parser-typescript.mjs')
    case PrettierModuleId.ParserYaml:
      return import('../../../third_party/prettier/esm/parser-yaml.mjs')
    case PrettierModuleId.Standalone:
      return import('../../../third_party/prettier/esm/standalone.mjs')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}

export const load = async (moduleId) => {
  const module = await loadInternal(moduleId)
  return module.default
}

export const loadAll = (moduleIds) => {
  return Promise.all(moduleIds.map(load))
}
