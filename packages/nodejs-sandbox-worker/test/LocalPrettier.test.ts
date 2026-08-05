/* eslint-disable @typescript-eslint/no-floating-promises */
import { deepStrictEqual, strictEqual } from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import {
  formatWithLocalPrettier,
  loadLocalPrettier,
  reset,
} from '../src/parts/LocalPrettier/LocalPrettier.ts'

afterEach(reset)

test('loads and formats with local Prettier and config in memory', async () => {
  loadLocalPrettier({
    cacheKey: 'workspace',
    config: undefined,
    configEntry: 'config',
    graph: {
      entries: {
        config: '/workspace/prettier.config.cjs',
        prettier: '/workspace/node_modules/prettier/standalone.js',
      },
      modules: [
        {
          dependencies: {},
          id: '/workspace/node_modules/prettier/standalone.js',
          source: `module.exports = {
  version: '3.6.0',
  format(content, options) {
    return options.marker + ':' + options.filepath + ':' + content
  },
}`,
        },
        {
          dependencies: {},
          id: '/workspace/prettier.config.cjs',
          source: `module.exports = { marker: 'sandboxed' }`,
        },
      ],
    },
    parser: 'babel',
    path: '/workspace/node_modules/prettier/standalone.js',
    pluginEntries: [],
    prettierEntry: 'prettier',
  })

  const result = await formatWithLocalPrettier(
    'workspace',
    '/workspace/test.js',
    'input',
    'babel',
  )

  deepStrictEqual(result, {
    formattedText: 'sandboxed:/workspace/test.js:input',
    path: '/workspace/node_modules/prettier/standalone.js',
    status: 'formatted',
    version: '3.6.0',
  })
})

test('protects filepath from local config overrides', async () => {
  loadLocalPrettier({
    cacheKey: 'workspace',
    config: {
      filepath: '/attacker-controlled.js',
    },
    configEntry: '',
    graph: {
      entries: {
        prettier: '/workspace/prettier.cjs',
      },
      modules: [
        {
          dependencies: {},
          id: '/workspace/prettier.cjs',
          source: `module.exports = {
  version: '3.6.0',
  format(content, options) {
    return options.filepath
  },
}`,
        },
      ],
    },
    parser: 'babel',
    path: '/workspace/prettier.cjs',
    pluginEntries: [],
    prettierEntry: 'prettier',
  })

  const result = (await formatWithLocalPrettier(
    'workspace',
    '/workspace/test.js',
    'input',
    'babel',
  )) as Readonly<Record<string, unknown>>

  strictEqual(result.formattedText, '/workspace/test.js')
})

test('uses a resolved configured plugin without passing its package name to Prettier', async () => {
  loadLocalPrettier({
    cacheKey: 'elm-workspace',
    config: {
      plugins: ['prettier-plugin-elm'],
    },
    configEntry: '',
    graph: {
      entries: {
        plugin: '/workspace/node_modules/prettier-plugin-elm/index.cjs',
        prettier: '/workspace/node_modules/prettier/standalone.js',
      },
      modules: [
        {
          dependencies: {},
          id: '/workspace/node_modules/prettier/standalone.js',
          source: `module.exports = {
  version: '3.6.0',
  format(content, options) {
    if ('parser' in options) throw new Error('unexpected parser')
    if (typeof options.plugins[0] === 'string') throw new Error('unresolved plugin')
    return options.plugins[0].format(content)
  },
}`,
        },
        {
          dependencies: {},
          id: '/workspace/node_modules/prettier-plugin-elm/index.cjs',
          source: `module.exports = {
  format(content) { return content.toUpperCase() },
}`,
        },
      ],
    },
    parser: undefined,
    path: '/workspace/node_modules/prettier/standalone.js',
    pluginEntries: ['plugin'],
    prettierEntry: 'prettier',
  })

  const result = (await formatWithLocalPrettier(
    'elm-workspace',
    '/workspace/Main.elm',
    'elm source',
    undefined,
  )) as Readonly<Record<string, unknown>>

  strictEqual(result.formattedText, 'ELM SOURCE')
})
