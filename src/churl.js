import isNil from 'inspected/schema/is-nil'
import isString from 'inspected/schema/is-string'
import isFunction from 'inspected/schema/is-function'
import isRequired from 'inspected/schema/is-required'
import isObject from 'inspected/schema/is-object'
import parse from './parse'

const createAdapted = adapter => ({
  get: async uri => {
    if (!isRequired(isString)(uri)) {
      throw new Error('Uri must be a string.')
    }

    let content = null

    await adapter(async http => {
      content = await http.get(uri)
    })

    return content
  },
  select: selector => content => {
    if (isNil(selector)) {
      throw new Error('No selector specified.')
    }

    let selected = null

    await adapter(async http => {
      selected = http.select(content, selector)
    })

    return selected
  },
  parse
})

const churl = options => adapter => {
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
    throw new Error('Adapter must be a function which returns an object.')
  }

  const result = {}

  result.use = async delegate => {
    if (!isRequired(isFunction)(delegate)) {
      throw new Error('Unexpected value, must be a function.')
    }

    await adapter(async http => {
      await delegate(createAdapted(async process => await process(http)))
    })
  }

  const funcs = ['get', 'select']

  funcs.forEach(f => {
    result[f] = createAdapted(adapter)[f]
  })

  return result
}

export default churl
