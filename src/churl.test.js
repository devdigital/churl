import churl from './index'
import puppeteer from './adapters/puppeteer'
import contentAdapterFactory from './adapters/content'

describe('churl', () => {
  it('should throw when adapter is undefined', () => {
    expect(() => churl()).toThrow('Adapter is not specified.')
  })

  it('should throw when adapter is null', () => {
    expect(() => churl()).toThrow('Adapter is not specified.')
  })

  it('should throw when adapter is not object', () => {
    expect(() => churl(false)).toThrow(
      'Adapter must be a function which returns an object.'
    )
  })

  it('use should throw when delegate is not a function', async () => {
    const { use } = churl(() => {})
    await expect(use(false)).rejects.toHaveProperty(
      'message',
      'Unexpected value, must be a function.'
    )
  })

  it('should return content when http get is passed uri', async () => {
    jest.setTimeout(30000)

    const { get } = churl(puppeteer)
    const content = await get('http://www.google.com')

    expect(content).toBeTruthy()
  })

  it('should return content with use', async () => {
    jest.setTimeout(30000)

    const { use } = churl(puppeteer)

    let content = null

    await use(async ({ get }) => {
      content = await get('http://www.google.com')
    })

    expect(content).toBeTruthy()
  })

  it('should return selected content', async () => {
    const content = '<h2>Hello</h2>'
    const { select } = churl(contentAdapterFactory(content))

    const selected = await select(content, 'h2')
    expect(selected.html()).toEqual('Hello')
  })
})
