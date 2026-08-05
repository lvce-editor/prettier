const format = (text) => {
  return text.replace(/\nmain\s*=\s*/, '\n\nmain =\n    ')
}

module.exports = {
  languages: [
    {
      extensions: ['.elm'],
      name: 'Elm',
      parsers: ['elm'],
    },
  ],
  parsers: {
    elm: {
      astFormat: 'elm-fixture',
      locEnd: (node) => node.source.length,
      locStart: () => 0,
      parse: (text) => ({
        formatted: format(text),
        source: text,
        type: 'ElmDocument',
      }),
    },
  },
  printers: {
    'elm-fixture': {
      print: (path) => path.getValue().formatted,
    },
  },
}
