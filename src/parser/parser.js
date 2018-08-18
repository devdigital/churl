import isNil from 'inspected/schema/is-nil'
import isFunction from 'inspected/schema/is-function'
import isObject from 'inspected/schema/is-object'
import parse from './parse'

const parser = options => adapter => {
  if (!isNil(options) && !isObject(options)) {
    throw new Error('Options is not a valid object.')
  }

  const defaultOptions = {}

  const mergedOptions = Object.assign({}, defaultOptions, options)

  // TODO: use merged options

  if (isNil(adapter)) {
    throw new Error('Adapter is not specified.')
  }

  if (!isFunction(adapter)) {
    throw new Error('Adapter must be a function.')
  }

  const adapted = adapter()

  const load = content => adapted.load(content)
  const select = selector => (loaded, context) =>
    adapted.select(loaded, selector, context)
  const value = selector => (loaded, context) =>
    adapted.value(loaded, selector, context)
  const map = (loaded, context, delegate) =>
    adapted.map(loaded, context, delegate)
  const configuredParse = parse({ load, map })

  return {
    load,
    select,
    value,
    parse: configuredParse,
  }
}

export default parser
