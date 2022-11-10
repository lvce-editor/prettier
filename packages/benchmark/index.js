import * as Format from '../extension/src/parts/Format/Format.js'

const main = async () => {
  await Format.format('/test/file.css', "h1{};'dedw ")
  console.time('format')
  await Format.format('/test/file.css', 'h1{} ')
  console.timeEnd('format')
}

main()
