// @flow
import * as React from 'react'
import { fieldSubscriptionItems } from 'final-form'
import type {
  FieldSubscription,
  FieldState,
  FormApi,
  FormValuesShape
} from 'final-form'
import type { UseFieldConfig, FieldInputProps, FieldRenderProps } from './types'
import isReactNative from './isReactNative'
import getValue from './getValue'
import useForm from './useForm'
import useLatest from './useLatest'
import { addLazyFieldMetaState } from './getters'

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

const defaultFormat = (value: ?any, name: string) =>
  value === undefined ? '' : value
const defaultParse = (value: ?any, name: string) =>
  value === '' ? undefined : value

const defaultIsEqual = (a: any, b: any): boolean => a === b

function useField<FormValues: FormValuesShape>(
  name: string,
  config: UseFieldConfig = {}
): FieldRenderProps {
  const {
    afterSubmit,
    allowNull,
    component,
    data,
    defaultValue,
    format = defaultFormat,
    formatOnBlur,
    initialValue,
    keepFieldStateOnUnmount = false,
    multiple,
    parse = defaultParse,
    subscription = all,
    type,
    validateFields,
    value: _value
  } = config
  const form: FormApi<FormValues> = useForm<FormValues>('useField')

  const configRef = useLatest(config)

  const register = () =>
    // avoid using `state` const in any closures created inside `register`
    // because they would refer `state` from current execution context
    // whereas actual `state` would defined in the subsequent `useField` hook
    // execution
    // (that would be caused by `setState` call performed in `register` callback)
    form.registerField(name, undefined, undefined, {
      afterSubmit,
      beforeSubmit: () => {
        const {
          beforeSubmit,
          formatOnBlur,
          format = defaultFormat
        } = configRef.current

        if (formatOnBlur) {
          const { value } = ((form.getFieldState(name): any): FieldState)
          const formatted = format(value, name)

          if (formatted !== value) {
            form.change(name, formatted)
          }
        }

        return beforeSubmit && beforeSubmit()
      },
      data,
      defaultValue,
      getValidator: () => configRef.current.validate,
      initialValue,
      isEqual: (a, b) => (configRef.current.isEqual || defaultIsEqual)(a, b),
      validateFields
    })

  const firstRenderRef = React.useRef(true)
  const unregisterRef = React.useRef()

  const registerAndGetInitialState: () => FieldState = () => {
    let initState
    if (!keepFieldStateOnUnmount) {
      unregisterRef.current && unregisterRef.current()
      unregisterRef.current = undefined
    } else {
      initState = form.getFieldState(name)
    }

    // if no initial state, register!
    if (!initState) {
      const unregisterFn = register()
      // only set unregister function when keepFieldStateOnUnmount option is false
      if (keepFieldStateOnUnmount === false) {
        unregisterRef.current = unregisterFn
      }
      initState = form.getFieldState(name)
    }

    return initState || {}
  }

  // register on first render
  // this will initially check for existing field state from the form before trying to register
  const [state, setState] = React.useState<FieldState>(
    registerAndGetInitialState
  )

  React.useEffect(
    () => {
      // make sure this doesn't get triggered on first render
      if (firstRenderRef.current === false) {
        unregisterRef.current && unregisterRef.current()
        setState(registerAndGetInitialState())
      }

      const unsubscribeFieldState = form.subscribeToFieldState(
        name,
        setState,
        subscription
      )

      firstRenderRef.current = false

      return () => {
        unsubscribeFieldState()
        unregisterRef.current && unregisterRef.current()
        unregisterRef.current = undefined
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [defaultValue, initialValue, name]
  )

  const handlers = {
    onBlur: React.useCallback(
      (event: ?SyntheticFocusEvent<*>) => {
        state.blur()
        if (formatOnBlur) {
          /**
           * Here we must fetch the value directly from Final Form because we cannot
           * trust that our `state` closure has the most recent value. This is a problem
           * if-and-only-if the library consumer has called `onChange()` immediately
           * before calling `onBlur()`, but before the field has had a chance to receive
           * the value update from Final Form.
           */
          const fieldState: any = form.getFieldState(state.name)
          state.change(format(fieldState.value, state.name))
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [state.name, format, formatOnBlur]
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
              `You must pass \`type="${
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
        state.change(parse(value, name))
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [_value, name, parse, state.change, state.value, type]
    ),
    onFocus: React.useCallback((event: ?SyntheticFocusEvent<*>) => {
      state.focus()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  }

  const meta = {}
  addLazyFieldMetaState(meta, state)
  const input: FieldInputProps = {
    name,
    get value() {
      let value = state.value
      if (formatOnBlur) {
        if (component === 'input') {
          value = defaultFormat(value, name)
        }
      } else {
        value = format(value, name)
      }
      if (value === null && !allowNull) {
        value = ''
      }
      if (type === 'checkbox' || type === 'radio') {
        return _value
      } else if (component === 'select' && multiple) {
        return value || []
      }
      return value
    },
    get checked() {
      if (type === 'checkbox') {
        if (_value === undefined) {
          return !!state.value
        } else {
          return !!(Array.isArray(state.value) && ~state.value.indexOf(_value))
        }
      } else if (type === 'radio') {
        return state.value === _value
      }
      return undefined
    },
    ...handlers
  }

  if (multiple) {
    input.multiple = multiple
  }
  if (type !== undefined) {
    input.type = type
  }

  const renderProps: FieldRenderProps = { input, meta } // assign to force Flow check
  return renderProps
}

export default useField
