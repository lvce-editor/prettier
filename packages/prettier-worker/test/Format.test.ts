import { expect, test } from '@jest/globals'
import * as Format from '../src/parts/Format/Format.ts'

test.skip('format javascript', () => {
  expect(Format.format('/tmp/index.ts', 'let x=1')).toBe(`let x = 1;
`)
})

// test('format javascriptreact', () => {
//   expect(
//     Format.format(
//       '/tmp/index.jsx',
//       `const Button = () => {
//   return <button>activate</button>
// }`
//     )
//   ).toBe(`const Button = () => {
//   return <button>activate</button>;
// };
// `)
// })

// test('format typescript', () => {
//   expect(Format.format('/tmp/index.ts', 'let x:number=1'))
//     .toBe(`let x: number = 1;
// `)
// })

// test('format css', () => {
//   expect(Format.format('/tmp/index.css', 'h1{height:10px}')).toBe(`h1 {
//   height: 10px;
// }
// `)
// })

// test('format html', () => {
//   expect(Format.format('/tmp/index.html', '<h1>   hello world</h1>'))
//     .toBe(`<h1>hello world</h1>
// `)
// })

// test('invalid html', () => {
//   expect(() => Format.format('/tmp/index.html', '<h1 </h1>')).toThrow(
//     /Failed to format \/tmp\/index.html: Unexpected closing tag "h1"./
//   )
// })
