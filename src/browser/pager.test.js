import pager from './pager'

describe('pager', () => {
  it('should throw if delegate is undefined', async () => {
    await expect(pager()()()).rejects.toHaveProperty(
      'message',
      'page delegate must be specified.'
    )
  })

  it('should throw if delegate is null', async () => {
    await expect(pager()()(null)).rejects.toHaveProperty(
      'message',
      'page delegate must be specified.'
    )
  })

  it('should pass context and data to delegate', async () => {
    let result = null
    await pager({ foo: 'bar' })(async accumulated => {
      result = accumulated
      return { complete: true }
    })('baz')

    expect(result).toEqual({
      context: { foo: 'bar' },
      value: 'baz',
      complete: false,
    })
  })

  it('should return assigned value', async () => {
    const result = await pager()(async () => {
      return {
        complete: true,
        value: 'foo',
      }
    })()

    expect(result).toEqual('foo')
  })

  it('should accumulate context and value', async () => {
    const result = await pager(10)(async accumulated => {
      const complete = accumulated.value > 50
      return {
        complete,
        context: accumulated.context - 1,
        value: accumulated.value + accumulated.context,
      }
    })(1)

    expect(result).toEqual(55)
  })
})
