import puppeteer from 'puppeteer'
import cheerio from 'cheerio'

const puppeteerAdapter = async delegate => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await delegate({
    get: async uri => {
      await page.goto(uri)
      return await page.content()
    },
    select: (content, selector) => {
      const $ = cheerio.load(content)
      return $(selector)
    },
    value: (content, selector) => {
      const element = this.select(content, selector)
      return element.html()
    },
  })

  await page.close()
  await browser.close()
}

export default puppeteerAdapter
