import parse from './parse'

describe('parse', () => {
  const content =
    '<h2>Hello</h2><ul><li><p>one</p></li><li><p>two</p></li></ul>'

  it('should parse expected content', () => {
    const result = parse({
      data: {
        title: value('h2'),
        items: {
          type: 'collection',
          itemScope: select('ul li'),
          data: value('p'),
        },
      },
    })(content)

    expect(result).toEqual({
      value: 'Hello',
      items: ['one', 'two'],
    })
  })
})
