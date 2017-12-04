import shallowEqual from './shallowEqual'

describe('shallowEqual', () => {
  it('returns false if either argument is null', () => {
    expect(shallowEqual(null, {})).toBe(false)
    expect(shallowEqual({}, null)).toBe(false)
  })

  it('returns true if both arguments are null or undefined', () => {
    expect(shallowEqual(null, null)).toBe(true)
    expect(shallowEqual(undefined, undefined)).toBe(true)
  })

  it('returns true if arguments are shallow equal', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).toBe(true)
  })

  it('returns false if arguments are not objects and not equal', () => {
    expect(shallowEqual(1, 2)).toBe(false)
  })

  it('returns false if only one argument is not an object', () => {
    expect(shallowEqual(1, {})).toBe(false)
  })

  it('returns false if first argument has too many keys', () => {
    expect(shallowEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).toBe(false)
  })

  it('returns false if second argument has too many keys', () => {
    expect(shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 })).toBe(false)
  })

  it('returns true if values are not primitives but are ===', () => {
    let obj = {}
    expect(shallowEqual({ a: 1, b: 2, c: obj }, { a: 1, b: 2, c: obj })).toBe(
      true
    )
  })

  it('returns false if arguments are not shallow equal', () => {
    expect(shallowEqual({ a: 1, b: 2, c: {} }, { a: 1, b: 2, c: {} })).toBe(
      false
    )
  })

  it('should treat objects created by `Object.create(null)` like any other plain object', () => {
    function Foo() {
      this.a = 1
    }
    Foo.prototype.constructor = null

    const object2 = { a: 1 }
    expect(shallowEqual(new Foo(), object2)).toBe(true)

    const object1 = Object.create(null)
    object1.a = 1
    expect(shallowEqual(object1, object2)).toBe(true)
  })
})
