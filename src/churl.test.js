import churl from './churl'
import puppeteer from './puppeteer'

describe('churl', () => {
  it('should throw when adapter is undefined', () => {
    expect(() => churl()).toThrow('Adapter is not specified.')
  })

  it('should throw when adapter is null', () => {
    expect(() => churl()).toThrow('Adapter is not specified.')
  })

  it('should throw when adapter is not object', () => {
    expect(() => churl(false)).toThrow(
      'Adapter must be a function which returns an object with get and context functions.'
    )
  })

  it('should throw when uri/delegate is not string or function', async () => {
    await expect(churl(() => {})(false)).rejects.toHaveProperty(
      'message',
      'Unexpected value, must be a uri or delegate.'
    )
  })

  it('should return content when http get is passed uri', async () => {
    jest.setTimeout(30000)

    const http = churl(puppeteer)
    const content = await http.get('http://www.google.com')

    expect(content).toBeTruthy()
  })

  it('should return content when invoked', async () => {
    jest.setTimeout(30000)

    const use = churl(puppeteer)

    let content = null
    await use(async http => {
      content = http.get('http://www.google.com')
    })

    expect(content).toBeTruthy()
  })
})
