import * as esbuild from 'esbuild'
import { spawn } from 'node:child_process'
import path from 'node:path'
import { root } from './root.js'

const extension = path.join(root, 'packages', 'extension')
const entryPoint = path.join(extension, 'src', 'prettierMain.ts')
const outfile = path.join(extension, 'dist', 'prettierMain.js')

const context = await esbuild.context({
  bundle: true,
  define: {
    PRETTIER_PATH_PREFIX: JSON.stringify('../../../node_modules/prettier'),
  },
  entryPoints: [entryPoint],
  external: ['electron', 'node:*'],
  format: 'esm',
  outfile,
  platform: 'browser',
  sourcemap: true,
  target: 'esnext',
})

await context.rebuild()
await context.watch()

const server = spawn(
  process.execPath,
  [
    path.join(
      root,
      'node_modules',
      '@lvce-editor',
      'server',
      'bin',
      'server.js',
    ),
    '--only-extension=packages/extension',
    '--test-path=packages/e2e',
  ],
  {
    cwd: root,
    env: {
      ...process.env,
      PORT: process.env.PORT || '3002',
    },
    stdio: 'inherit',
  },
)

const stop = async () => {
  server.kill()
  await context.dispose()
}

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

server.on('exit', async (code) => {
  await context.dispose()
  process.exit(code ?? 0)
})
