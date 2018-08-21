import pager from './pager'

describe('pager', () => {
  it('should throw if delegate is undefined', async () => {
    await expect(pager()()).rejects.toHaveProperty(
      'message',
      'delegate must be specified.'
    )
  })

  it('should throw if delegate is null', async () => {
    await expect(pager()(null)).rejects.toHaveProperty(
      'message',
      'delegate must be specified.'
    )
  })

  it('should throw if delegate is not a function', async () => {
    await expect(pager()(false)).rejects.toHaveProperty(
      'message',
      'delegate must be a function.'
    )
  })

  it('should pass context and uri to delegate', async () => {
    let result = null
    await pager({ foo: 'bar' }, 'baz')(
      async (context, uri) => (result = { context, uri })
    )
    expect(result).toEqual({ context: { foo: 'bar' }, uri: 'baz' })
  })
})
