import flattenSubscription from './flattenSubscription'

describe('flattenSubscription', () => {
  it('should return empty array when subscription is empty', () => {
    expect(flattenSubscription(undefined)).toEqual([])
    expect(flattenSubscription({})).toEqual([])
  })

  it('should return only keys that are true in subscription', () => {
    expect(flattenSubscription({ foo: true, bar: false })).toEqual(['foo'])
    expect(flattenSubscription({ foo: true, bar: true, baz: false })).toEqual([
      'foo',
      'bar'
    ])
  })
})
