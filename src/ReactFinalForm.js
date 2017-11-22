// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import warning from 'warning'
import {
  createForm,
  formSubscriptionItems,
  version as ffVersion
} from 'final-form'
import type { Api, Config, FormSubscription, FormState } from 'final-form'
import type { FormProps as Props, ReactContext } from './types'
import renderComponent from './renderComponent'
export const version = '0.0.2'

const all: FormSubscription = formSubscriptionItems.reduce((result, key) => {
  result[key] = true
  return result
}, {})

type State = {
  state: FormState
}

export default class ReactFinalForm extends React.PureComponent<Props, State> {
  context: ReactContext
  props: Props
  state: State
  form: Api
  unsubscribe: () => void

  static childContextTypes = {
    reactFinalForm: PropTypes.object
  }

  static displayName = `ReactFinalForm(${ffVersion})(${version})`

  constructor(props: Props) {
    super(props)
    const {
      children,
      component,
      debug,
      initialValues,
      onSubmit,
      render,
      validate,
      subscription
    } = props
    warning(
      render || typeof children === 'function' || component,
      'Must specify either a render prop, a render function as children, or a component prop'
    )
    const config: Config = {
      debug,
      initialValues,
      onSubmit,
      validate
    }
    try {
      this.form = createForm(config)
    } catch (e) {
      warning(false, e.message)
    }
    let initialState
    this.unsubscribe =
      this.form &&
      this.form.subscribe((state: FormState) => {
        if (initialState) {
          this.notify(state)
        } else {
          initialState = state
        }
      }, subscription || all)
    this.state = { state: initialState }
  }

  getChildContext() {
    return {
      reactFinalForm: {
        registerField: this.form && this.form.registerField // no need to bind because FF does not use "this"
      }
    }
  }

  notify = (state: FormState) => this.setState({ state })
  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    this.form.submit()
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    // remove config props
    const {
      debug,
      initialValues,
      onSubmit,
      subscription,
      validate,
      ...props
    } = this.props
    return renderComponent(
      {
        ...props,
        ...this.state.state,
        handleSubmit: this.handleSubmit
      },
      'ReactFinalForm'
    )
  }
}
