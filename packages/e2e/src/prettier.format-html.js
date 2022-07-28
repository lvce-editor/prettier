import {
  getTmpDir,
  runWithExtension,
  test,
} from '@lvce-editor/test-with-playwright'
import { writeFile } from 'fs/promises'
import { join } from 'node:path'

test('prettier.format-html', async (t) => {
  const tmpDir = await getTmpDir()
  await writeFile(join(tmpDir, 'test.html'), `<h1> hello world </h1>`)
  const page = await runWithExtension({
    folder: tmpDir,
  })
  const testHtml = page.locator('text=test.html')
  await testHtml.click()

  // TODO test that formatting works as expected
})
