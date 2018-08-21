import isFunction from 'inspected/schema/is-function'
import isNil from 'inspected/schema/is-nil'

const pager = (context, uri) => async delegate => {
  if (isNil(delegate)) {
    throw new Error('delegate must be specified.')
  }

  if (!isFunction(delegate)) {
    throw new Error('delegate must be a function.')
  }

  let currentContext = context
  let currentUri = uri

  let result = { complete: false }
  while (result.complete === false) {
    result = await delegate(currentContext, currentUri)

    if (!result) {
      break
    }

    currentContext = result.context
    currentUri = result.uri
  }
}

export default pager
