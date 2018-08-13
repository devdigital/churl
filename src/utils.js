import cheerio from 'cheerio'

const testAdapterFactory = content => async delegate => {
  await delegate({
    get: async () => content,
    select: async (content, selector) => {
      const $ = cheerio.load(content)
      return $(selector)
    },
  })
}

export default testAdapterFactory
