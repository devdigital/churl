import puppeteer from './puppeteer'

describe('puppeteer adapter', () => {
  it('should return content when calling get', async () => {
    jest.setTimeout(20000)

    let content = null
    await puppeteer(async http => {
      content = await http.get('http://www.google.com')
    })

    expect(content).toBeTruthy()
  })
})
