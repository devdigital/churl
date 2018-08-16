import cheerio from 'cheerio'
import isNil from 'inspected/schema/is-nil'

const cheerioAdapter = () => ({
  context: content => console.log('content', content) || cheerio.load(content),
  select: (context, selector) => {
    console.log(context, selector)
    return context(selector)
  },
  value: (context, selector) => {
    const element = context(selector)
    return isNil(element) ? null : element.html()
  },
})

export default cheerioAdapter
