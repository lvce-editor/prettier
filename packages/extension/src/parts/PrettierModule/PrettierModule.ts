import * as PluginAcorn from 'prettier/plugins/acorn'
import * as PluginAngular from 'prettier/plugins/angular'
import * as PluginBabel from 'prettier/plugins/babel'
import * as PluginEstree from 'prettier/plugins/estree'
import * as PluginFlow from 'prettier/plugins/flow'
import * as PluginGlimmer from 'prettier/plugins/glimmer'
import * as PluginGraphql from 'prettier/plugins/graphql'
import * as PluginHtml from 'prettier/plugins/html'
import * as PluginMarkdown from 'prettier/plugins/markdown'
import * as PluginMeriyah from 'prettier/plugins/meriyah'
import * as PluginPostCss from 'prettier/plugins/postcss'
import * as PluginTypeScript from 'prettier/plugins/typescript'
import * as PluginYaml from 'prettier/plugins/yaml'
import * as Standalone from 'prettier/standalone'
import * as PrettierModuleId from '../PrettierModuleId/PrettierModuleId.ts'

const loadInternal = (moduleId) => {
  switch (moduleId) {
    case PrettierModuleId.PluginAcorn:
      return PluginAcorn
    case PrettierModuleId.PluginAngular:
      return PluginAngular
    case PrettierModuleId.PluginBabel:
      return PluginBabel
    case PrettierModuleId.PluginEstree:
      return PluginEstree
    case PrettierModuleId.PluginFlow:
      return PluginFlow
    case PrettierModuleId.PluginGlimmer:
      return PluginGlimmer
    case PrettierModuleId.PluginGraphql:
      return PluginGraphql
    case PrettierModuleId.PluginHtml:
      return PluginHtml
    case PrettierModuleId.PluginMarkdown:
      return PluginMarkdown
    case PrettierModuleId.PluginMeriyah:
      return PluginMeriyah
    case PrettierModuleId.PluginPostCss:
      return PluginPostCss
    case PrettierModuleId.PluginTypeScript:
      return PluginTypeScript
    case PrettierModuleId.PluginYaml:
      return PluginYaml
    case PrettierModuleId.Standalone:
      return Standalone
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
