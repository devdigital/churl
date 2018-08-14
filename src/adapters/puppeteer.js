import puppeteer from 'puppeteer'

const puppeteerAdapter = async delegate => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await delegate({
    get: async uri => {
      await page.goto(uri)
      return await page.content()
    },
    select: async (_, selector) => page.$(selector),
  })

  await page.close()
  await browser.close()
}

export default puppeteerAdapter
