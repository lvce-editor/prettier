import * as AssetDir from '../src/parts/AssetDir/AssetDir.ts'

test('assetDir', () => {
  expect(typeof AssetDir.assetDir).toBe('string')
})
