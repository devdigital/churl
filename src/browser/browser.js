import isNil from 'inspected/schema/is-nil'
import isString from 'inspected/schema/is-string'
import isFunction from 'inspected/schema/is-function'
import isRequired from 'inspected/schema/is-required'
import isObject from 'inspected/schema/is-object'

import pager from './pager'

const createAdapted = adapter => ({
  get: async uri => {
    if (!isRequired(isString)(uri)) {
      throw new Error('get uri must be a string.')
    }

    let content = null

    await adapter(async adapted => {
      content = await adapted.get(uri)
    })

    return content
  },
  page: delegate => async data => {
    let result = null

    await adapter(async adapted => {
      result = await pager(adapted.context())(delegate)(data)
    })

    return result
  },
})

const browser = options => adapter => {
  if (!isNil(options) && !isObject(options)) {
    throw new Error('browser options is not a valid object.')
  }

  const defaultOptions = {}

  const mergedOptions = Object.assign({}, defaultOptions, options)

  // TODO: use merged options

  if (isNil(adapter)) {
    throw new Error('browser adapter is not specified.')
  }

  if (!isFunction(adapter)) {
    throw new Error('browser adapter must be a function.')
  }

  const result = {}

  result.use = async delegate => {
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
