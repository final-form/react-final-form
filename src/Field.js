// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import { fieldSubscriptionItems } from 'final-form'
import diffSubscription from './diffSubscription'
import type { FieldSubscription, FieldState } from 'final-form'
import type {
  FieldProps as Props,
  FieldRenderProps,
  ReactContext
} from './types'
import renderComponent from './renderComponent'
import isReactNative from './isReactNative'
import getValue from './getValue'

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

type State = {
  state: ?FieldState
}

class Field extends React.Component<Props, State> {
  context: ReactContext
  props: Props
  state: State
  unsubscribe: () => void

  static contextTypes = {
    reactFinalForm: PropTypes.object
  }

  static defaultProps = {
    format: (value: ?any, name: string) => (value === undefined ? '' : value),
    parse: (value: ?any, name: string) => (value === '' ? undefined : value)
  }

  constructor(props: Props, context: ReactContext) {
    super(props, context)
    let initialState

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production' && !context.reactFinalForm) {
      console.error(
        'Warning: Field must be used inside of a ReactFinalForm component'
      )
    }

    if (this.context.reactFinalForm) {
      // avoid error, warning will alert developer to their mistake
      this.subscribe(props, (state: FieldState) => {
        if (initialState) {
          this.notify(state)
        } else {
          initialState = state
        }
      })
    }
    this.state = { state: initialState }
  }

  subscribe = (
    { isEqual, name, subscription, validateFields }: Props,
    listener: (state: FieldState) => void
  ) => {
    this.unsubscribe = this.context.reactFinalForm.registerField(
      name,
      listener,
      subscription || all,
      {
        isEqual,
        getValidator: () => this.props.validate,
        validateFields
      }
    )
  }

  notify = (state: FieldState) => this.setState({ state })

  componentDidUpdate(prevProps: Props) {
    const { name, subscription } = this.props
    if (
      prevProps.name !== name ||
      diffSubscription(
        prevProps.subscription,
        subscription,
        fieldSubscriptionItems
      )
    ) {
      if (this.context.reactFinalForm) {
        // avoid error, warning will alert developer to their mistake
        this.unsubscribe()
        this.subscribe(this.props, this.notify)
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handlers = {
    onBlur: (event: ?SyntheticFocusEvent<*>) => {
      const { state } = this.state
      // this is to appease the Flow gods
      // istanbul ignore next
      if (state) {
        const { format, formatOnBlur } = this.props
        state.blur()
        if (format && formatOnBlur) {
          state.change(format(state.value, state.name))
        }
      }
    },
    onChange: (event: SyntheticInputEvent<*> | any) => {
      const { parse, value: _value } = this.props

      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production' && event && event.target) {
        const targetType = event.target.type
        const props: Object = this.props
        const unknown =
          ~['checkbox', 'radio', 'select-multiple'].indexOf(targetType) &&
          !props.type

        const type = targetType === 'select-multiple' ? 'select' : targetType
        const { value }: any =
          targetType === 'select-multiple' ? this.state.state || {} : props

        if (unknown) {
          console.error(
            `Warning: You must pass \`type="${type}"\` prop to your Field(${
              props.name
            }) component.\n` +
              `Without it we don't know how to unpack your \`value\` prop - ${
                Array.isArray(value) ? `[${value}]` : `"${value}"`
              }.`
          )
        }
      }

      const value: any =
        event && event.target
          ? getValue(
              event,
              this.state.state && this.state.state.value,
              _value,
              isReactNative
            )
          : event
      this.state.state &&
        this.state.state.change(parse ? parse(value, this.props.name) : value)
    },
    onFocus: (event: ?SyntheticFocusEvent<*>) => {
      this.state.state && this.state.state.focus()
    }
  }

  render() {
    const {
      allowNull,
      component,
      children,
      format,
      formatOnBlur,
      parse,
      isEqual,
      name,
      subscription,
      validate,
      validateFields,
      value: _value,
      ...rest
    } = this.props
    let { blur, change, focus, value, name: ignoreName, ...otherState } =
      this.state.state || {}
    const meta = {
      // this is to appease the Flow gods
      active: otherState.active,
      data: otherState.data,
      dirty: otherState.dirty,
      dirtySinceLastSubmit: otherState.dirtySinceLastSubmit,
      error: otherState.error,
      initial: otherState.initial,
      invalid: otherState.invalid,
      pristine: otherState.pristine,
      submitError: otherState.submitError,
      submitFailed: otherState.submitFailed,
      submitSucceeded: otherState.submitSucceeded,
      touched: otherState.touched,
      valid: otherState.valid,
      visited: otherState.visited
    }
    if (formatOnBlur) {
      value = Field.defaultProps.format(value, name)
    } else if (format) {
      value = format(value, name)
    }
    if (value === null && !allowNull) {
      value = ''
    }
    const input = { name, value, ...this.handlers }
    if ((rest: Object).type === 'checkbox') {
      if (_value === undefined) {
        ;(input: Object).checked = !!value
      } else {
        ;(input: Object).checked = !!(
          Array.isArray(value) && ~value.indexOf(_value)
        )
        input.value = _value
      }
    } else if ((rest: Object).type === 'radio') {
      ;(input: Object).checked = value === _value
      input.value = _value
    } else if (component === 'select' && (rest: Object).multiple) {
      input.value = input.value || []
    }

    if (typeof children === 'function') {
      return (children: Function)({ input, meta, ...rest })
    }

    if (typeof component === 'string') {
      // ignore meta, combine input with any other props
      return React.createElement(component, { ...input, children, ...rest })
    }
    const renderProps: FieldRenderProps = { input, meta } // assign to force Flow check
    return renderComponent(
      { ...renderProps, children, component, ...rest },
      `Field(${name})`
    )
  }
}

export default Field
