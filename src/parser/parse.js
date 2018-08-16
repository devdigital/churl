const parse = contextResolver => definition => content => {
  // TODO: validate inputs

  const context = contextResolver(content)
  return content
}

export default parse
