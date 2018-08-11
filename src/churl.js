import isNil from 'inspected/schema/is-nil'
import isString from 'inspected/schema/is-string'
import isObject from 'inspected/schema/is-object'
import isFunction from 'inspected/schema/is-function'
import isRequired from 'inspected/schema/is-required'
import validate from 'inspected/validate'

class Http {
  constructor(adapter) {
    if (isNil(adapter)) {
      throw new Error('No adapter specified.')
    }

    this.adapter = adapter
  }

  async get(uri) {
    if (isNil(uri)) {
      throw new Error('No uri specified.')
    }

    if (!isString(uri)) {
      throw new Error('Uri should be a string.')
    }

    return await this.adapter.get(uri)
  }
}

const churl = adapter => {
  if (isNil(adapter)) {
    throw new Error('Adapter is not specified.')
  }

  if (!isFunction(adapter)) {
    throw new Error(
      'Adapter must be a function which returns an object with get and context functions.'
    )
  }

  const func = async delegate => {
    if (isRequired(isFunction)(delegate)) {
      await adapter(async http => {
        await delegate(new Http(http))
      })

      return
    }

    throw new Error('Unexpected value, must be a uri or delegate.')
  }

  func.get = async uri => {
    if (!isRequired(isString)(uri)) {
      throw new Error('Uri must be a string.')
    }

    let content = null
    await adapter(async http => {
      content = await http.get(uri)
    })
    return content
  }

  return func
}

export default churl
