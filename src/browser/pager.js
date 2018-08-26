import isFunction from 'inspected/schema/is-function'
import isNil from 'inspected/schema/is-nil'

const pager = (context, data) => async delegate => {
  if (isNil(delegate)) {
    throw new Error('delegate must be specified.')
  }

  if (!isFunction(delegate)) {
    throw new Error('delegate must be a function.')
  }

  let currentContext = context
  let currentData = data

  let result = { complete: false }
  while (result.complete === false) {
    result = await delegate(currentContext, currentData)

    if (!result) {
      break
    }

    currentContext = result.context
    currentData = result.data
  }
}

export default pager
