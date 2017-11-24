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
        true
      )
    ).toBe(null)
  })

  it('should return event.target.checked if checkbox', () => {
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
        false
      )
    ).toBe(false)
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
        false
      )
    ).toBe('foo')
  })
})
