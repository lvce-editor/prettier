import { expect, test } from '@jest/globals'
import * as PrettierModuleId from '../../src/parts/PrettierModuleId/PrettierModuleId.ts'

test('exports stable prettier module ids', () => {
  expect(PrettierModuleId.PluginAcornAndEspree).toBe(1)
  expect(PrettierModuleId.PluginAngular).toBe(2)
  expect(PrettierModuleId.PluginBabel).toBe(3)
  expect(PrettierModuleId.PluginFlow).toBe(4)
  expect(PrettierModuleId.PluginGlimmer).toBe(5)
  expect(PrettierModuleId.PluginGraphql).toBe(6)
  expect(PrettierModuleId.PluginHtml).toBe(7)
  expect(PrettierModuleId.PluginMarkdown).toBe(8)
  expect(PrettierModuleId.PluginMeriyah).toBe(9)
  expect(PrettierModuleId.PluginPostCss).toBe(10)
  expect(PrettierModuleId.PluginTypeScript).toBe(11)
  expect(PrettierModuleId.PluginYaml).toBe(12)
  expect(PrettierModuleId.Standalone).toBe(13)
  expect(PrettierModuleId.PluginAcorn).toBe(14)
  expect(PrettierModuleId.PluginEstree).toBe(15)
})
