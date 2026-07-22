import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, test } from '@jest/globals'

const extensionRoot = join(import.meta.dirname, '..')

const readJson = async (path: string): Promise<any> => {
  return JSON.parse(await readFile(path, 'utf8'))
}

describe('package.json schema contribution', () => {
  test('is declared in the extension manifest', async () => {
    const manifest = await readJson(join(extensionRoot, 'extension.json'))
    expect(manifest.jsonValidation).toContainEqual({
      fileMatch: 'package.json',
      url: './schemas/package.schema.json',
    })
  })

  test('describes common boolean, integer, and enum options', async () => {
    const schema = await readJson(
      join(extensionRoot, 'schemas', 'package.schema.json'),
    )
    const properties = schema.properties.prettier.properties
    expect(properties.semi).toMatchObject({ type: 'boolean' })
    expect(properties.singleQuote).toMatchObject({ type: 'boolean' })
    expect(properties.printWidth).toMatchObject({ type: 'integer', minimum: 0 })
    expect(properties.trailingComma.enum).toEqual(['all', 'es5', 'none'])
  })
})
