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

function useField<FormValues: FormValuesShape>(
  name: string,
  {
    afterSubmit,
    allowNull,
    beforeSubmit,
    component,
    defaultValue,
    format = defaultFormat,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    parse = defaultParse,
    subscription = all,
    type,
    validate,
    validateFields,
    value: _value
  }: UseFieldConfig = {}
): FieldRenderProps {
  const form: FormApi<FormValues> = useForm<FormValues>('useField')

  const validateRef = useLatest(validate)

  const beforeSubmitRef = useLatest(() => {
    if (formatOnBlur) {
      const formatted = format(state.value, state.name)
      if (formatted !== state.value) {
        state.change(formatted)
      }
    }
    return beforeSubmit && beforeSubmit()
  })

  const register = (callback: FieldState => void, omitInitialValue: ?boolean) =>
    form.registerField(name, callback, subscription, {
      afterSubmit,
      beforeSubmit: () => beforeSubmitRef.current(),
      defaultValue,
      getValidator: () => validateRef.current,
      initialValue: omitInitialValue ? undefined : initialValue,
      isEqual,
      validateFields
    })

  const firstRender = React.useRef(true)

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FieldState>((): FieldState => {
    let initialState: FieldState = {}

    // temporarily disable destroyOnUnregister
    const destroyOnUnregister = form.destroyOnUnregister
    form.destroyOnUnregister = false

    // Avoid passing initialValue if the field value is present in form already
    // as initialValue will overwrite value if a field is re-mounted
    let formState = form.getState()
    const _initialValue =
      formState && formState.values && formState.values[name]
    const omitInitialValue = _initialValue !== undefined

    register(state => {
      initialState = state
    }, omitInitialValue)()

    // return destroyOnUnregister to its original value
    form.destroyOnUnregister = destroyOnUnregister

    return initialState
  })

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
      isEqual
      // The validateFields array is often passed as validateFields={[]}, creating
      // a !== new array every time. If it needs to be changed, a rerender/reregister
      // can be forced by changing the key prop
      // validateFields
    ]
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
