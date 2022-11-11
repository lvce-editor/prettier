import * as Format from '../extension/src/parts/Format/Format.js'
const code = `a {
  color: red;
}
`
const main = async () => {
  await Format.format('/test/file.css', code)
  console.time('format')
  await Format.format('/test/file.css', code)
  console.timeEnd('format')
}

main()
