import isNil from 'inspected/schema/is-nil'

const pager = context => delegate => async value => {
  if (isNil(delegate)) {
    throw new Error('page delegate must be specified.')
  }

  let accumulated = { complete: false, context, value }
  while (accumulated.complete === false) {
    accumulated = await delegate(accumulated)

    if (!accumulated) {
      break
    }
  }

  if (!accumulated) {
    return null
  }

  return accumulated.value ? accumulated.value : null
}

export default pager
