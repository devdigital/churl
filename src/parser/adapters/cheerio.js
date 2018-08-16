import cheerio from 'cheerio'
import isNil from 'inspected/schema/is-nil'

// TODO: rename map?
const cheerioAdapter = () => ({
  context: content => cheerio.load(content),
  select: (context, selector) => context(selector),
  map: (context, selector) => context(selector).get(),
  value: (context, selector) => {
    const element = context(selector)
    return isNil(element) ? null : element.html()
  },
})

export default cheerioAdapter
