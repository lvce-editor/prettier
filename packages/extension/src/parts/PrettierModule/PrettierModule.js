import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

const loadInternal = (moduleId) => {
  switch (moduleId) {
    case PrettierModuleId.PluginAcornAndEspree:
      return import(
        '../../../third_party/prettier-v3/plugins/acorn-and-espree.mjs'
      )
    case PrettierModuleId.PluginAngular:
      return import('../../../third_party/prettier-v3/plugins/angular.mjs')
    case PrettierModuleId.PluginBabel:
      return import('../../../third_party/prettier-v3/plugins/babel.mjs')
    case PrettierModuleId.PluginFlow:
      return import('../../../third_party/prettier-v3/plugins/flow.mjs')
    case PrettierModuleId.PluginGlimmer:
      return import('../../../third_party/prettier-v3/plugins/glimmer.mjs')
    case PrettierModuleId.PluginGraphql:
      return import('../../../third_party/prettier-v3/plugins/graphql.mjs')
    case PrettierModuleId.PluginHtml:
      return import('../../../third_party/prettier-v3/plugins/html.mjs')
    case PrettierModuleId.PluginMarkdown:
      return import('../../../third_party/prettier-v3/plugins/markdown.mjs')
    case PrettierModuleId.PluginMeriyah:
      return import('../../../third_party/prettier-v3/plugins/meriyah.mjs')
    case PrettierModuleId.PluginPostCss:
      return import('../../../third_party/prettier-v3/plugins/postcss.mjs')
    case PrettierModuleId.PluginTypeScript:
      return import('../../../third_party/prettier-v3/plugins/typescript.mjs')
    case PrettierModuleId.PluginYaml:
      return import('../../../third_party/prettier-v3/plugins/yaml.mjs')
    case PrettierModuleId.Standalone:
      return import('../../../third_party/prettier-v3/standalone.mjs')
    default:
      throw new Error(`module ${moduleId} not found`)
  }
}

export const load = async (moduleId) => {
  const module = await loadInternal(moduleId)
  // @ts-ignore
  if (module.default) {
    // @ts-ignore
    return module.default
  }
  return module
}

export const loadAll = (moduleIds) => {
  return Promise.all(moduleIds.map(load))
}
