import isNil from 'inspected/schema/is-nil'
import isFunction from 'inspected/schema/is-function'
import isObject from 'inspected/schema/is-object'

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
  return {
    select: adapted.select,
    value: adapter.value,
  }
}

export default parser
