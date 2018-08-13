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

// const puppeteerSelectorParser = selector => {}

// puppeteerAdapter.contextOptions = {
//   selectorParser: puppeteerSelectorParser,
// }

// const toPuppeteerSelectorResolver = async (context, selector) => {
//   if (isString(selector)) {
//     return await context.$(selector)
//   }
// }

// const puppeteerValueResolver = async (
//   context,
//   selectorOrDefinition,
//   result = {}
// ) => {
//   if (isSelector(selectorOrDefinition)) {
//     const valueResolver = toPuppeteerSelectorResolver(
//       context,
//       selectorOrDefinition
//     )
//     return await valueResolver(context)
//   }

//   return await parseDefinitionObject(
//     context,
//     selectorOrDefinition,
//     puppeteerValueResolver
//   )
// }

// export const toPuppeteerOptions = page => ({
//   getContext: () => page,
//   valueResolver: puppeteerValueResolver,
// })
