import isObject from 'inspected/schema/is-object'
import isFunction from 'inspected/schema/is-function'
import isNil from 'inspected/schema/is-nil'
import isArray from 'inspected/schema/is-array'
import { getDefaultSettings } from 'http2'

// definition contains
// type: 'item' or 'collection', default = 'item'
// scope: function, default = context => context
// itemScope: required for 'collection' type, no default, context => []
// data: function or data definition object

const retrieve = definition => {
  if (!isObject(definition)) {
    throw new Error('Definition is not a valid object.')
  }

  const type = definition.type || 'item'
  const scope = definition.scope || (context => context)
  const itemScope = definition.itemScope
  const data = definition.data

  if (type !== 'item' && type !== 'collection') {
    throw new Error('type is invalid, must be item or collection.')
  }

  if (type === 'item' && !isNil(itemScope)) {
    throw new Error('itemScope must not be specified for item types.')
  }

  if (type === 'collection' && isNil(itemScope)) {
    throw new Error('itemScope must be specified for collection types.')
  }

  if (!isFunction(scope)) {
    throw new Error('scope must be a function.')
  }

  if (isNil(data)) {
    throw new Error('data must be specified.')
  }

  if (!isFunction(data) && !isObject(data)) {
    throw new Error('data must be a function or an object.')
  }

  return {
    type,
    scope,
    itemScope,
    data,
  }
}

const getData = (context, data) => {
  if (isNil(data)) {
    throw new Error('Unexpected nil data.')
  }

  console.log(data)
  if (isFunction(data)) {
    return data(context)
  }

  if (isObject(data)) {
    return Object.keys(data).reduce((result, key) => {
      if (isObject(data[key])) {
        result[key] = parseDefinition(context, data[key])
      } else {
        result[key] = data[key](context)
      }
      return result
    })
  }

  throw new Error('Unexpected data type, must be a function or an object.')
}

const parseDefinition = (context, definition) => {
  const { type, scope, itemScope, data } = retrieve(definition)

  context = scope(context)

  if (type === 'collection') {
    const items = itemScope(context)
    if (!isArray(items)) {
      throw new Error('itemScope does not return a collection.')
    }

    return items.map(context => getData(context, data))
  }

  return getData(context, data)
}

const parse = contextResolver => definition => content => {
  if (!isFunction(contextResolver)) {
    throw new Error('contextResolver must be a function.')
  }

  if (!isObject(definition)) {
    throw new Error('definition must be an object.')
  }

  if (isNil(content)) {
    return null
  }

  const context = contextResolver(content)
  return parseDefinition(context, definition)
}

export default parse
