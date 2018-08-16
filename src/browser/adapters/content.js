const contentAdapterFactory = content => async delegate => {
  await delegate({
    get: async () => content,
  })
}

export default contentAdapterFactory
