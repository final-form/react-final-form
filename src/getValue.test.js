import { noop } from 'lodash'
import getValue from './getValue'

describe('getValue', () => {
  it('should return event.nativeEvent.text if defined and not react-native', () => {
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          nativeEvent: {
            text: 'foo'
          }
        },
        undefined,
        false
      )
    ).toBe('foo')
  })

  it('should return event.nativeEvent.text if react-native', () => {
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          nativeEvent: {
            text: 'foo'
          }
        },
        undefined,
        true
      )
    ).toBe('foo')
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          nativeEvent: {
            text: undefined
          }
        },
        undefined,
        true
      )
    ).toBe(undefined)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          nativeEvent: {
            text: null
          }
        },
        undefined,
        true
      )
    ).toBe(null)
  })

  it('should return event.target.checked if checkbox with no value parameter', () => {
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: true
          }
        },
        undefined,
        true
      )
    ).toBe(true)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: true
          }
        },
        undefined,
        false
      )
    ).toBe(true)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: undefined
          }
        },
        undefined,
        true
      )
    ).toBe(false)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: undefined
          }
        },
        undefined,
        false
      )
    ).toBe(false)
  })

  it('should return add or remove the value to an array if checkbox with value parameter', () => {
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: true,
            value: 'foo'
          }
        },
        undefined,
        false
      )
    ).toEqual(['foo'])
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: true,
            value: 'C'
          }
        },
        ['A', 'B'],
        false
      )
    ).toEqual(['A', 'B', 'C'])
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: false,
            value: 'foo'
          }
        },
        ['foo'],
        false
      )
    ).toEqual([])
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: false,
            value: 'B'
          }
        },
        ['A', 'B', 'C'],
        false
      )
    ).toEqual(['A', 'C'])
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: false,
            value: 'F'
          }
        },
        ['A', 'B', 'C'],
        false
      )
    ).toEqual(['A', 'B', 'C'])
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'checkbox',
            checked: false,
            value: 'F'
          }
        },
        undefined,
        false
      )
    ).toBeUndefined()
  })

  it('should return a number type for numeric inputs, when a value is set', () => {
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'number',
            value: '3.1415'
          }
        },
        undefined,
        true
      )
    ).toBe('3.1415')
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'range',
            value: '2.71828'
          }
        },
        undefined,
        true
      )
    ).toBe('2.71828')
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'number',
            value: '3'
          }
        },
        undefined,
        false
      )
    ).toBe('3')
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'range',
            value: '3.1415'
          }
        },
        undefined,
        false
      )
    ).toBe('3.1415')

    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'range',
            value: ''
          }
        },
        undefined,
        false
      )
    ).toBe('')
  })

  it('should return selected options if is a multiselect', () => {
    const options = [
      { selected: true, value: 'foo' },
      { selected: true, value: 'bar' },
      { selected: false, value: 'baz' }
    ]
    const expected = options
      .filter(option => option.selected)
      .map(option => option.value)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'select-multiple',
            options
          }
        },
        undefined,
        true
      )
    ).toEqual(expected)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'select-multiple'
          }
        },
        undefined,
        false
      )
    ).toEqual([]) // no options specified
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            type: 'select-multiple',
            options
          }
        },
        undefined,
        false
      )
    ).toEqual(expected)
  })

  it('should return event.target.value if not file or checkbox', () => {
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: undefined
          }
        },
        undefined,
        true
      )
    ).toBe(undefined)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: undefined
          }
        },
        undefined,
        false
      )
    ).toBe(undefined)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: null
          }
        },
        undefined,
        true
      )
    ).toBe(null)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: null
          }
        },
        undefined,
        false
      )
    ).toBe(null)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: true
          }
        },
        undefined,
        true
      )
    ).toBe(true)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: true
          }
        },
        undefined,
        false
      )
    ).toBe(true)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: false
          }
        },
        undefined,
        true
      )
    ).toBe(false)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: false
          }
        },
        undefined,
        false
      )
    ).toBe(false)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: 42
          }
        },
        undefined,
        true
      )
    ).toBe(42)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: 42
          }
        },
        undefined,
        false
      )
    ).toBe(42)
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: 'foo'
          }
        },
        undefined,
        true
      )
    ).toBe('foo')
    expect(
      getValue(
        {
          preventDefault: noop,
          stopPropagation: noop,
          target: {
            value: 'foo'
          }
        },
        undefined,
        false
      )
    ).toBe('foo')
  })
})
