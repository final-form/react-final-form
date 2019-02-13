// @flow
import * as React from 'react'
import { fieldSubscriptionItems } from 'final-form'
import diffSubscription from './diffSubscription'
import type { FieldSubscription, FieldState } from 'final-form'
import type {
  FieldPropsWithForm as Props,
  FieldRenderInputProp,
  FieldRenderMetaProp
} from './types'
import renderComponent from './renderComponent'
import isReactNative from './isReactNative'
import getValue from './getValue'
import { withReactFinalForm } from './reactFinalFormContext'

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

type State = {
  state: ?FieldState,
  mounted: boolean
}

class Field extends React.Component<Props, State> {
  props: Props
  state: State = { state: undefined, mounted: false }
  unsubscribe: () => void

  static defaultProps = {
    format: (value: ?any, name: string) => (value === undefined ? '' : value),
    parse: (value: ?any, name: string) => (value === '' ? undefined : value)
  }

  constructor(props: Props) {
    super(props)

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production' && !props.reactFinalForm) {
      console.error(
        'Warning: Field must be used inside of a ReactFinalForm component'
      )
    }
  }

  notify = (state: FieldState) => this.setState({ state })

  subscribe = () => {
    const {
      isEqual,
      name,
      subscription,
      validateFields,
      reactFinalForm
    } = this.props
    this.unsubscribe = reactFinalForm.registerField(
      name,
      this.notify,
      subscription || all,
      {
        isEqual,
        getValidator: () => this.props.validate,
        validateFields
      }
    )
  }

  componentDidMount() {
    if (this.props.reactFinalForm) {
      // avoid error, warning will alert developer to their mistake
      this.subscribe()
    }
    this.setState({ mounted: true })
  }

  componentDidUpdate(prevProps: Props) {
    const { name, subscription } = this.props
    if (
      this.props.reactFinalForm &&
      (prevProps.name !== name ||
        diffSubscription(
          prevProps.subscription,
          subscription,
          fieldSubscriptionItems
        ))
    ) {
      // avoid error, warning will alert developer to their mistake
      this.unsubscribe()
      this.subscribe()
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

      const { state } = this.state

      const value: any =
        event && event.target
          ? getValue(event, state && state.value, _value, isReactNative)
          : event

      state && state.change(parse ? parse(value, this.props.name) : value)
    },
    onFocus: (event: ?SyntheticFocusEvent<*>) => {
      this.state.state && this.state.state.focus()
    }
  }

  render() {
    // If is in form, but hasn't been mounted yet, don't render anything.
    // This will re-render from `componentDidMount` and flush within the same tick.
    if (!this.state.mounted) {
      return null
    }

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
      reactFinalForm,
      value: _value,
      ...rest
    } = this.props

    const { blur, change, focus, value, name: ignoreName, ...otherState } =
      this.state.state || {}

    const input: FieldRenderInputProp = { name, value, ...this.handlers }
    const meta: FieldRenderMetaProp = otherState

    if (formatOnBlur) {
      input.value = Field.defaultProps.format(input.value, name)
    } else if (format) {
      input.value = format(input.value, name)
    }
    if (input.value === null && !allowNull) {
      input.value = ''
    }

    if ((rest: Object).type === 'checkbox') {
      if (_value === undefined) {
        input.checked = !!input.value
      } else {
        input.checked =
          Array.isArray(input.value) && !!~input.value.indexOf(_value)
        input.value = _value
      }
    } else if ((rest: Object).type === 'radio') {
      input.checked = input.value === _value
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

    return renderComponent(
      { input, meta, children, component, ...rest },
      `Field(${name})`
    )
  }
}

export default withReactFinalForm(Field)
