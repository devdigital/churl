import isNil from 'inspected/schema/is-nil'
import isString from 'inspected/schema/is-string'
import isFunction from 'inspected/schema/is-function'
import isRequired from 'inspected/schema/is-required'
import isObject from 'inspected/schema/is-object'

import pager from './pager'

const createAdapted = adapter => ({
  get: async uri => {
    if (!isRequired(isString)(uri)) {
      throw new Error('Uri must be a string.')
    }

    let content = null

    await adapter(async adapted => {
      content = await adapted.get(uri)
    })

    return content
  },
  page: async (uri, delegate) => {
    if (!isRequired(isString)(uri)) {
      throw new Error('Uri must be a string.')
    }

    await adapter(async adapted => {
      pager(adapted.context(), uri)(delegate)
    })
  },
})

const browser = options => adapter => {
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

  const result = {}

  result.use = async delegate => {
    if (!isRequired(isFunction)(delegate)) {
      throw new Error('Unexpected value, must be a function.')
    }

    await adapter(async adapted => {
      await delegate(createAdapted(async process => await process(adapted)))
    })
  }

  // Provide a subset of functions outside of 'use'
  const funcs = ['get']

  funcs.forEach(f => {
    result[f] = createAdapted(adapter)[f]
  })

  return result
}

export default browser
