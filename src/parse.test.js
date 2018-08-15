import churl from './index'
import contentAdapterFactory from './adapters/content'

describe('parse', () => {
  const content =
    '<h2>Hello</h2><ul><li><p>one</p></li><li><p>two</p></li></ul>'

  const { parse, value, select } = churl(contentAdapterFactory(content))
  it('should parse expected content', async () => {
    const result = await parse({
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
