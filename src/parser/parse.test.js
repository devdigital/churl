import parser from './parser'
import cheerio from './adapters/cheerio'

const content = '<h2>Hello</h2><ul><li><p>one</p></li><li><p>two</p></li></ul>'

describe('parse', () => {
  it('should parse expected content', () => {
    const { value, select, parse } = parser()(cheerio)
    const result = parse({
      type: 'item',
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
      title: 'Hello',
      items: ['one', 'two'],
    })
  })

  it('should return top level scalar collection', () => {
    const { value, select, parse } = parser()(cheerio)
    const result = parse({
      type: 'collection',
      itemScope: select('ul li'),
      data: value('p'),
    })(content)

    expect(result).toEqual(['one', 'two'])
  })

  it('should return collection items', () => {
    const { value, map, parse } = parser()(cheerio)
    const result = parse({
      type: 'collection',
      itemScope: map('ul li'),
      data: {
        item: value('p'),
        value: value('p'),
      },
    })(content)

    expect(result).toEqual([
      { item: 'one', value: 'one' },
      { item: 'two', value: 'two' },
    ])
  })
})
