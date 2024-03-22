import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.js'

const pathPrefix = '../../../../../node_modules/prettier'

const loadInternal = (moduleId) => {
  switch (moduleId) {
    case PrettierModuleId.PluginAcorn:
      return import(`${pathPrefix}/plugins/acorn.mjs`)
    case PrettierModuleId.PluginAngular:
      return import(`${pathPrefix}/plugins/angular.mjs`)
    case PrettierModuleId.PluginBabel:
      return import(`${pathPrefix}/plugins/babel.mjs`)
    case PrettierModuleId.PluginEstree:
      return import(`${pathPrefix}/plugins/estree.mjs`)
    case PrettierModuleId.PluginFlow:
      return import(`${pathPrefix}/plugins/flow.mjs`)
    case PrettierModuleId.PluginGlimmer:
      return import(`${pathPrefix}/plugins/glimmer.mjs`)
    case PrettierModuleId.PluginGraphql:
      return import(`${pathPrefix}/plugins/graphql.mjs`)
    case PrettierModuleId.PluginHtml:
      return import(`${pathPrefix}/plugins/html.mjs`)
    case PrettierModuleId.PluginMarkdown:
      return import(`${pathPrefix}/plugins/markdown.mjs`)
    case PrettierModuleId.PluginMeriyah:
      return import(`${pathPrefix}/plugins/meriyah.mjs`)
    case PrettierModuleId.PluginPostCss:
      return import(`${pathPrefix}/plugins/postcss.mjs`)
    case PrettierModuleId.PluginTypeScript:
      return import(`${pathPrefix}/plugins/typescript.mjs`)
    case PrettierModuleId.PluginYaml:
      return import(`${pathPrefix}/plugins/yaml.mjs`)
    case PrettierModuleId.Standalone:
      return import(`${pathPrefix}/standalone.mjs`)
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
