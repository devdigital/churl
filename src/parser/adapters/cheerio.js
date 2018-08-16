import cheerio from 'cheerio'

const cheerioAdapter = () => ({
  select: (content, selector) => {
    const $ = cheerio.load(content)
    return $(selector)
  },
  value: (content, selector) => {
    const element = this.select(content, selector)
    return element.html()
  },
})

export default cheerioAdapter
