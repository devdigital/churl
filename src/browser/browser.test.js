import browser from './browser'
import puppeteer from './adapters/puppeteer'
import { Page } from 'puppeteer/lib/Page'

describe('browser', () => {
  it('should throw when options are not an object', () => {
    expect(browser(false)).toThrow('browser options is not a valid object.')
  })

  it('should throw when adapter is undefined', () => {
    expect(() => browser()()).toThrow('browser adapter is not specified.')
  })

  it('should throw when adapter is null', () => {
    expect(() => browser()(null)).toThrow('browser adapter is not specified.')
  })

  it('should throw when adapter is not object', () => {
    expect(() => browser()(false)).toThrow(
      'browser adapter must be a function.'
    )
  })

  it('should return content from get', async () => {
    jest.setTimeout(30000)

    const { get } = browser()(puppeteer)
    const content = await get('http://www.google.com')
    expect(content).toBeTruthy()
  })

  it('should return content from use', async () => {
    jest.setTimeout(30000)

    const { use } = browser()(puppeteer)

    let content = null
    await use(async ({ get }) => {
      content = await get('http://www.google.com')
    })

    expect(content).toBeTruthy()
  })

  it('should pass configured page function with page context', async () => {
    const { use } = browser()(puppeteer)

    let result = null
    await use(async ({ page }) => {
      await page(accumulated => {
        result = accumulated
        return {
          complete: true,
        }
      })()
    })

    expect(result.context).toBeInstanceOf(Page)
  })

  it('should return expected value from page', async () => {
    const { use } = browser()(puppeteer)

    let result = null
    await use(async ({ page }) => {
      result = await page(accumulated => {
        return Object.assign({}, accumulated, { complete: true })
      })('foo')
    })

    expect(result).toEqual('foo')
  })
})
