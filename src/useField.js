// @flow
import * as React from 'react'
import { fieldSubscriptionItems } from 'final-form'
import flattenSubscription from './flattenSubscription'
import type { FieldSubscription, FieldState, FormApi } from 'final-form'
import type { UseFieldConfig, FieldInputProps, FieldRenderProps } from './types'
import isReactNative from './isReactNative'
import getValue from './getValue'
import ReactFinalFormContext from './context'

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const defaultFormat = (value: ?any, name: string) =>
  value === undefined ? '' : value
const defaultParse = (value: ?any, name: string) =>
  value === '' ? undefined : value

const useField = (
  name: string,
  {
    allowNull,
    component,
    defaultValue,
    format = defaultFormat,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    parse = defaultParse,
    subscription,
    type,
    validate,
    validateFields,
    value: _value
  }: UseFieldConfig = {}
): FieldRenderProps => {
  const reactFinalForm: ?FormApi = React.useContext(ReactFinalFormContext)
  if (!reactFinalForm) {
    throw new Error(
      'Warning: useField must be used inside of a ReactFinalForm component'
    )
  }

  // keep ref to most recent copy of validate function
  const validateRef = React.useRef(validate)
  React.useEffect(() => {
    validateRef.current = validate
  })

  const register = (callback: FieldState => void) =>
    reactFinalForm.registerField(name, callback, subscription || all, {
      defaultValue,
      getValidator: () => validateRef.current,
      initialValue,
      isEqual,
      validateFields
    })

  const firstRender = React.useRef(true)

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FieldState>(
    (): FieldState => {
      let initialState: FieldState = {}
      register(state => {
        initialState = state
      })()
      return initialState
    }
  )

  const flattenedSubscription = flattenSubscription(subscription || all)
  // useDependenciesDebugger({
  //   name,
  //   defaultValue,
  //   validate,
  //   initialValue,
  //   isEqual,
  //   validateFields,
  //   reactFinalForm
  // })
  React.useEffect(
    () =>
      register(state => {
        if (firstRender.current) {
          firstRender.current = false
        } else {
          setState(state)
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      defaultValue,
      // If we want to allow inline fat-arrow field-level validation functions, we
      // cannot reregister field every time validate function !==.
      // validate,
      initialValue,
      isEqual,
      validateFields,
      reactFinalForm,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ...flattenedSubscription
    ]
  )

  const handlers = {
    onBlur: React.useCallback(
      (event: ?SyntheticFocusEvent<*>) => {
        // this is to appease the Flow gods
        // istanbul ignore next
        if (state) {
          state.blur()
          if (format && formatOnBlur) {
            state.change(format(state.value, state.name))
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [state.name, state.value, format, formatOnBlur]
    ),
    onChange: React.useCallback(
      (event: SyntheticInputEvent<*> | any) => {
        // istanbul ignore next
        if (process.env.NODE_ENV !== 'production' && event && event.target) {
          const targetType = event.target.type
          const unknown =
            ~['checkbox', 'radio', 'select-multiple'].indexOf(targetType) &&
            !type

          const value: any =
            targetType === 'select-multiple' ? state.value : _value

          if (unknown) {
            console.error(
              `Warning: You must pass \`type="${
                targetType === 'select-multiple' ? 'select' : targetType
              }"\` prop to your Field(${name}) component.\n` +
                `Without it we don't know how to unpack your \`value\` prop - ${
                  Array.isArray(value) ? `[${value}]` : `"${value}"`
                }.`
            )
          }
        }

        const value: any =
          event && event.target
            ? getValue(event, state.value, _value, isReactNative)
            : event
        state.change(parse ? parse(value, name) : value)
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [_value, name, parse, state.value, type]
    ),
    onFocus: React.useCallback((event: ?SyntheticFocusEvent<*>) => {
      state.focus()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }

  let { blur, change, focus, value, name: ignoreName, ...otherState } = state
  const meta = {
    // this is to appease the Flow gods
    active: otherState.active,
    data: otherState.data,
    dirty: otherState.dirty,
    dirtySinceLastSubmit: otherState.dirtySinceLastSubmit,
    error: otherState.error,
    initial: otherState.initial,
    invalid: otherState.invalid,
    modified: otherState.modified,
    pristine: otherState.pristine,
    submitError: otherState.submitError,
    submitFailed: otherState.submitFailed,
    submitSucceeded: otherState.submitSucceeded,
    submitting: otherState.submitting,
    touched: otherState.touched,
    valid: otherState.valid,
    visited: otherState.visited
  }
  if (formatOnBlur) {
    value = defaultFormat(value, name)
  } else if (format) {
    value = format(value, name)
  }
  if (value === null && !allowNull) {
    value = ''
  }
  const input: FieldInputProps = { name, value, ...handlers }
  if (type === 'checkbox') {
    input.type = type // make sure it gets passed along to input
    if (_value === undefined) {
      input.checked = !!value
    } else {
      input.checked = !!(Array.isArray(value) && ~value.indexOf(_value))
      input.value = _value
    }
  } else if (type === 'radio') {
    input.type = type // make sure it gets passed along to input
    input.checked = value === _value
    input.value = _value
  } else if (component === 'select' && multiple) {
    input.value = input.value || []
    input.multiple = true
  }

  const renderProps: FieldRenderProps = { input, meta } // assign to force Flow check
  return renderProps
}

export default useField
