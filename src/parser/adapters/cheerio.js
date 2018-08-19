import cheerio from 'cheerio'
import isNil from 'inspected/schema/is-nil'

const load = content => cheerio.load(content)

const select = (loaded, selector, context) =>
  context ? loaded(selector, context) : loaded(selector)

const value = (loaded, selector, context) => {
  const element = select(loaded, selector, context)
  return isNil(element) ? null : element.html()
}

const map = (loaded, context, delegate) =>
  loaded(context)
    .get()
    .map(i => delegate(i))

const cheerioAdapter = () => ({
  load,
  select,
  value,
  map,
})

export default cheerioAdapter
