import isNil from 'inspected/schema/is-nil'
import isString from 'inspected/schema/is-string'
import isObject from 'inspected/schema/is-object'
import isFunction from 'inspected/schema/is-function'
import isRequired from 'inspected/schema/is-required'
import validate from 'inspected/validate'

const createAdapted = adapter => {
  return {
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
    select: async (content, selector) => {
      // TODO: checks on content, selector
      let selected = null

      await adapter(async http => {
        selected = await http.select(content, selector)
      })

      return selected
    },
  }
}

const churl = adapter => {
  if (isNil(adapter)) {
    throw new Error('Adapter is not specified.')
  }

  if (!isFunction(adapter)) {
    throw new Error('Adapter must be a function which returns an object.')
  }

  const func = async delegate => {
    if (!isRequired(isFunction)(delegate)) {
      throw new Error('Unexpected value, must be a function.')
    }

    await adapter(async http => {
      await delegate(createAdapted(async process => await process(http)))
    })
  }

  func.get = async uri => {
    return createAdapted(adapter).get(uri)
  }

  func.select = async (content, selector) => {
    return createAdapted(adapter).select(content, selector)
  }

  return func
}

export default churl
