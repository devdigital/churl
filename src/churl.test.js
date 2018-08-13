import churl from './churl'
import puppeteer from './puppeteer'
import testAdapterFactory from './utils'

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

  it('should throw when delegate is not a function', async () => {
    await expect(churl(() => {})(false)).rejects.toHaveProperty(
      'message',
      'Unexpected value, must be a function.'
    )
  })

  it('should return content when http get is passed uri', async () => {
    jest.setTimeout(30000)

    const http = churl(puppeteer)
    const content = await http.get('http://www.google.com')

    expect(content).toBeTruthy()
  })

  it('should return content with use', async () => {
    jest.setTimeout(30000)

    const use = churl(puppeteer)

    let content = null

    await use(async http => {
      content = await http.get('http://www.google.com')
      content = await http.get('http://www.test.com')
    })

    expect(content).toBeTruthy()
  })

  it('should return selected content', async () => {
    const content = '<h2>Hello</h2>'
    const http = churl(testAdapterFactory(content))

    const selected = await http.select(content, 'h2')
    expect(selected.html()).toEqual('Hello')
  })
})
