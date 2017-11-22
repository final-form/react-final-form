import diffSubscription from './diffSubscription'

describe('diffSubscription', () => {
  it('should return true if only one subscription is defined', () => {
    expect(diffSubscription(undefined, {}, ['foo'])).toBe(true)
    expect(diffSubscription({}, undefined, ['foo'])).toBe(true)
  })

  it('should return false if all supplied keys are ===', () => {
    expect(
      diffSubscription(
        {
          foo: 2,
          bar: 5
        },
        {
          foo: 2,
          bar: 5
        },
        ['foo', 'bar']
      )
    ).toBe(false)
  })

  it('should return true if some supplied keys are !==', () => {
    expect(
      diffSubscription(
        {
          foo: 2,
          bar: 5
        },
        {
          foo: 2,
          bar: 4
        },
        ['foo', 'bar']
      )
    ).toBe(true)
  })
})
