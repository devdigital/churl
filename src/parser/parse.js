import isObject from 'inspected/schema/is-object'
import isFunction from 'inspected/schema/is-function'
import isNil from 'inspected/schema/is-nil'

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
  const scope = definition.scope || ((_, context) => context)
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

const getData = (loaded, map, context, data) => {
  if (isNil(data)) {
    throw new Error('Unexpected nil data.')
  }

  if (isFunction(data)) {
    return data(loaded, context)
  }

  if (isObject(data)) {
    return Object.keys(data).reduce((result, key) => {
      if (isObject(data[key])) {
        result[key] = parseDefinition(loaded, map, data[key], context)
      } else {
        result[key] = data[key](loaded, context)
      }
      return result
    })
  }

  throw new Error('Unexpected data type, must be a function or an object.')
}

const parseDefinition = (loaded, map, definition, context) => {
  const { type, scope, itemScope, data } = retrieve(definition)

  context = scope(loaded, context)

  if (type === 'collection') {
    const itemContext = itemScope(loaded, context)
    return map(loaded, itemContext, context =>
      getData(loaded, map, context, data)
    )
  }

  return getData(loaded, map, context, data)
}

const parse = resolver => definition => content => {
  if (!isObject(resolver)) {
    throw new Error('resolver must be an object.')
  }

  if (!isFunction(resolver.load)) {
    throw new Error('resolver.load must be a function.')
  }

  if (!isFunction(resolver.map)) {
    throw new Error('resolver.map must be a function.')
  }

  if (!isObject(definition)) {
    throw new Error('definition must be an object.')
  }

  if (isNil(content)) {
    return null
  }

  const loaded = resolver.load(content)
  return parseDefinition(loaded, resolver.map, definition)
}

export default parse
