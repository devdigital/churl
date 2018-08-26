import parser from './parser'
import cheerio from './adapters/cheerio'

describe('parser', () => {
  it('should throw when options are not an object', () => {
    expect(parser(false)).toThrow('parse options is not a valid object.')
  })

  it('should throw when adapter is undefined', () => {
    expect(() => parser()()).toThrow('parse adapter is not specified.')
  })

  it('should throw when adapter is null', () => {
    expect(() => parser()(null)).toThrow('parse adapter is not specified.')
  })

  it('should throw when adapter is not object', () => {
    expect(() => parser()(false)).toThrow('parse adapter must be a function.')
  })
})
