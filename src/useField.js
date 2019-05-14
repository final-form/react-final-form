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

export const defaultFormat = (value: ?any, name: string) =>
  value === undefined ? '' : value
export const defaultParse = (value: ?any, name: string) =>
  value === '' ? undefined : value

const useField = (
  name: string,
  {
    allowNull,
    component,
    defaultValue,
    format,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    parse,
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
  }, [validate])

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
    onBlur: (event: ?SyntheticFocusEvent<*>) => {
      // this is to appease the Flow gods
      // istanbul ignore next
      if (state) {
        state.blur()
        if (format && formatOnBlur) {
          state.change(format(state.value, state.name))
        }
      }
    },
    onChange: (event: SyntheticInputEvent<*> | any) => {
      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production' && event && event.target) {
        const targetType = event.target.type
        const unknown =
          ~['checkbox', 'radio', 'select-multiple'].indexOf(targetType) && !type

        const { value }: any =
          targetType === 'select-multiple' ? state || {} : { value: _value }

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
    onFocus: (event: ?SyntheticFocusEvent<*>) => {
      state.focus()
    }
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
    if (_value === undefined) {
      ;(input: Object).checked = !!value
    } else {
      ;(input: Object).checked = !!(
        Array.isArray(value) && ~value.indexOf(_value)
      )
      input.value = _value
    }
  } else if (type === 'radio') {
    ;(input: Object).checked = value === _value
    input.value = _value
  } else if (component === 'select' && multiple) {
    input.value = input.value || []
    input.multiple = true
  }

  const renderProps: FieldRenderProps = { input, meta } // assign to force Flow check
  return renderProps
}

export default useField
