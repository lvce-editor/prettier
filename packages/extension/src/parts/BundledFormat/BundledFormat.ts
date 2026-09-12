import * as PluginModule from '../PluginModule/PluginModule.ts'
import * as Prettier from '../Prettier/Prettier.ts'
import * as PrettierModule from '../PrettierModule/PrettierModule.ts'

export const format = async (
  uri: string,
  content: string,
  options: Record<string, unknown>,
): Promise<string> => {
  const { parser, plugins } = PluginModule.loadPlugin(uri)
  const pluginInstances = await PrettierModule.loadAll(plugins)
  return Prettier.format(content, {
    ...options,
    parser,
    plugins: pluginInstances,
  })
}
