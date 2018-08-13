import isNil from 'inspected/schema/is-nil'
import isString from 'inspected/schema/is-string'

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

export default Http
