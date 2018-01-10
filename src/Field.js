// @flow
import * as React from 'react'
import warning from './warning'
import PropTypes from 'prop-types'
import { fieldSubscriptionItems } from 'final-form'
import diffSubscription from './diffSubscription'
import type { FieldSubscription, FieldState } from 'final-form'
import type { FieldProps as Props, ReactContext } from './types'
import renderComponent from './renderComponent'
import isReactNative from './isReactNative'
import getValue from './getValue'

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

type State = {
  state: FieldState
}

export default class Field extends React.PureComponent<Props, State> {
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
    warning(
      context.reactFinalForm,
      'Field must be used inside of a ReactFinalForm component'
    )
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
    this.state = { state: initialState || {} }
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
        validate: this.validate,
        validateFields
      }
    )
  }

  validate = (value: ?any, allValues: Object) =>
    this.props.validate && this.props.validate(value, allValues)

  notify = (state: FieldState) => this.setState({ state })

  componentWillReceiveProps(nextProps: Props) {
    const { name, subscription } = nextProps
    if (
      this.props.name !== name ||
      diffSubscription(
        this.props.subscription,
        subscription,
        fieldSubscriptionItems
      )
    ) {
      if (this.context.reactFinalForm) {
        // avoid error, warning will alert developer to their mistake
        this.unsubscribe()
        this.subscribe(nextProps, this.notify)
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  handlers = {
    onBlur: (event: ?SyntheticFocusEvent<*>) => {
      this.state.state.blur()
    },
    onChange: (event: SyntheticInputEvent<*> | any) => {
      const { parse } = this.props
      const value: any =
        event && event.target
          ? getValue(event, this.state.state.value, isReactNative)
          : event
      this.state.state.change(
        parse !== null ? parse(value, this.props.name) : value
      )
    },
    onFocus: (event: ?SyntheticFocusEvent<*>) => {
      this.state.state.focus()
    }
  }

  render() {
    const {
      allowNull,
      component,
      children,
      format,
      parse,
      isEqual,
      name,
      subscription,
      validate,
      validateFields,
      value: _value,
      ...rest
    } = this.props
    let {
      blur,
      change,
      focus,
      value,
      name: ignoreName,
      ...meta
    } = this.state.state
    if (format !== null) {
      value = format(value, name)
    }
    if (value === null && !allowNull) {
      value = ''
    }
    const input = { name, value, ...this.handlers }
    warning(
      !_value || (rest.type === 'radio' && component === 'input'),
      'The value prop on Field is ONLY for use with component="input" and type="radio".'
    )
    if (rest.type === 'checkbox') {
      input.checked = !!value
    } else if (rest.type === 'radio') {
      input.checked = value === _value
      input.value = _value
    }
    if (component === 'select' && rest.multiple) {
      input.value = input.value || []
    }
    if (typeof children === 'function') {
      return (children: Function)({ input, meta, ...rest })
    }

    if (typeof component === 'string') {
      // ignore meta, combine input with any other props
      return React.createElement(component, { ...input, children, ...rest })
    }
    return renderComponent(
      { input, meta, children, component, ...rest },
      `Field(${name})`
    )
  }
}
