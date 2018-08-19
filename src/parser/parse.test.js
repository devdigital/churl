import parser from './parser'
import cheerio from './adapters/cheerio'

const content = '<h2>Hello</h2><ul><li><p>one</p></li><li><p>two</p></li></ul>'

describe('parse', () => {
  it('should return null for undefined content', () => {
    const { parse } = parser()(cheerio)
    const result = parse({})()
    expect(result).toEqual(null)
  })

  it('should return null for null content', () => {
    const { parse } = parser()(cheerio)
    const result = parse({})(null)
    expect(result).toEqual(null)
  })

  it('should return top level item', () => {
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
    const { value, select, parse } = parser()(cheerio)
    const result = parse({
      type: 'collection',
      itemScope: select('ul li'),
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

  it('should return nested items', () => {
    const { value, select, parse } = parser()(cheerio)
    const result = parse({
      type: 'item',
      data: {
        title: value('h2'),
        item: {
          scope: select('ul'),
          data: {
            value: value('li p'),
            item: {
              scope: select('li'),
              data: {
                value: (l, c) => l('p', l(c).next()).html(),
              },
            },
          },
        },
      },
    })(content)

    expect(result).toEqual({
      title: 'Hello',
      item: {
        value: 'one',
        item: {
          value: 'two',
        },
      },
    })
  })
})
