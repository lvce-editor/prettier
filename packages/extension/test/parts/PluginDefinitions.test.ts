import { expect, test } from '@jest/globals'
import * as PluginAngular from '../../src/parts/PluginAngular/PluginAngular.ts'
import * as PluginCss from '../../src/parts/PluginCss/PluginCss.ts'
import * as PluginGraphql from '../../src/parts/PluginGraphql/PluginGraphql.ts'
import * as PluginHtml from '../../src/parts/PluginHtml/PluginHtml.ts'
import * as PluginJavaScript from '../../src/parts/PluginJavaScript/PluginJavaScript.ts'
import * as PluginJavaScriptReact from '../../src/parts/PluginJavaScriptReact/PluginJavaScriptReact.ts'
import * as PluginJson from '../../src/parts/PluginJson/PluginJson.ts'
import * as PluginJsonc from '../../src/parts/PluginJsonc/PluginJsonc.ts'
import * as PluginLess from '../../src/parts/PluginLess/PluginLess.ts'
import * as PluginMarkdown from '../../src/parts/PluginMarkdown/PluginMarkdown.ts'
import * as PluginScss from '../../src/parts/PluginScss/PluginScss.ts'
import * as PluginTypeScript from '../../src/parts/PluginTypeScript/PluginTypeScript.ts'
import * as PluginTypeScriptReact from '../../src/parts/PluginTypeScriptReact/PluginTypeScriptReact.ts'
import * as PluginVue from '../../src/parts/PluginVue/PluginVue.ts'
import * as PluginYaml from '../../src/parts/PluginYaml/PluginYaml.ts'
import * as PrettierModuleId from '../../src/parts/PrettierModuleId/PrettierModuleId.ts'
import * as PrettierParserId from '../../src/parts/PrettierParserId/PrettierParserId.ts'

test('angular plugin definition uses angular parser and html/angular plugins', () => {
  expect(PluginAngular.parser).toBe(PrettierParserId.Angular)
  expect(PluginAngular.plugins).toEqual([
    PrettierModuleId.PluginHtml,
    PrettierModuleId.PluginAngular,
  ])
})

test('css plugin definition uses postcss plugin', () => {
  expect(PluginCss.parser).toBe(PrettierParserId.Css)
  expect(PluginCss.plugins).toEqual([PrettierModuleId.PluginPostCss])
})

test('graphql plugin definition uses graphql plugin', () => {
  expect(PluginGraphql.parser).toBe(PrettierParserId.GraphQl)
  expect(PluginGraphql.plugins).toEqual([PrettierModuleId.PluginGraphql])
})

test('html plugin definition uses html plugin', () => {
  expect(PluginHtml.parser).toBe(PrettierParserId.Html)
  expect(PluginHtml.plugins).toEqual([PrettierModuleId.PluginHtml])
})

test('javascript plugin definition uses babel and estree plugins', () => {
  expect(PluginJavaScript.parser).toBe(PrettierParserId.Babel)
  expect(PluginJavaScript.plugins).toEqual([
    PrettierModuleId.PluginBabel,
    PrettierModuleId.PluginEstree,
  ])
})

test('javascript react plugin definition uses babel and estree plugins', () => {
  expect(PluginJavaScriptReact.parser).toBe(PrettierParserId.Babel)
  expect(PluginJavaScriptReact.plugins).toEqual([
    PrettierModuleId.PluginBabel,
    PrettierModuleId.PluginEstree,
  ])
})

test('json plugin definition uses json parser', () => {
  expect(PluginJson.parser).toBe(PrettierParserId.Json)
  expect(PluginJson.plugins).toEqual([
    PrettierModuleId.PluginBabel,
    PrettierModuleId.PluginEstree,
  ])
})

test('jsonc plugin definition uses json parser', () => {
  expect(PluginJsonc.parser).toBe(PrettierParserId.Json)
  expect(PluginJsonc.plugins).toEqual([
    PrettierModuleId.PluginBabel,
    PrettierModuleId.PluginEstree,
  ])
})

test('less plugin definition uses postcss plugin', () => {
  expect(PluginLess.parser).toBe(PrettierParserId.Less)
  expect(PluginLess.plugins).toEqual([PrettierModuleId.PluginPostCss])
})

test('markdown plugin definition uses markdown plugin', () => {
  expect(PluginMarkdown.parser).toBe(PrettierParserId.Markdown)
  expect(PluginMarkdown.plugins).toEqual([PrettierModuleId.PluginMarkdown])
})

test('scss plugin definition uses postcss plugin', () => {
  expect(PluginScss.parser).toBe(PrettierParserId.Scss)
  expect(PluginScss.plugins).toEqual([PrettierModuleId.PluginPostCss])
})

test('typescript plugin definition uses typescript and estree plugins', () => {
  expect(PluginTypeScript.parser).toBe(PrettierParserId.TypeScript)
  expect(PluginTypeScript.plugins).toEqual([
    PrettierModuleId.PluginTypeScript,
    PrettierModuleId.PluginEstree,
  ])
})

test('typescript react plugin definition uses typescript and estree plugins', () => {
  expect(PluginTypeScriptReact.parser).toBe(PrettierParserId.TypeScript)
  expect(PluginTypeScriptReact.plugins).toEqual([
    PrettierModuleId.PluginTypeScript,
    PrettierModuleId.PluginEstree,
  ])
})

test('vue plugin definition uses html parser', () => {
  expect(PluginVue.parser).toBe(PrettierParserId.Html)
  expect(PluginVue.plugins).toEqual([PrettierModuleId.PluginHtml])
})

test('yaml plugin definition uses yaml plugin', () => {
  expect(PluginYaml.parser).toBe(PrettierParserId.Yaml)
  expect(PluginYaml.plugins).toEqual([PrettierModuleId.PluginYaml])
})
