// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import warning from './warning'
import {
  createForm,
  formSubscriptionItems,
  version as ffVersion
} from 'final-form'
import type {
  FormApi,
  Config,
  FormSubscription,
  FormState,
  Unsubscribe
} from 'final-form'
import type { FormProps as Props, ReactContext } from './types'
import shallowEqual from './shallowEqual'
import renderComponent from './renderComponent'
export const version = '2.0.0'

export const all: FormSubscription = formSubscriptionItems.reduce(
  (result, key) => {
    result[key] = true
    return result
  },
  {}
)

type State = {
  state: FormState
}

export default class ReactFinalForm extends React.PureComponent<Props, State> {
  context: ReactContext
  props: Props
  state: State
  form: FormApi
  unsubscriptions: Unsubscribe[]

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
      decorators,
      initialValues,
      mutators,
      onSubmit,
      render,
      subscription,
      validate,
      validateOnBlur
    } = props
    warning(
      render || typeof children === 'function' || component,
      'Must specify either a render prop, a render function as children, or a component prop'
    )
    const config: Config = {
      debug,
      initialValues,
      mutators,
      onSubmit,
      validate,
      validateOnBlur
    }
    try {
      this.form = createForm(config)
    } catch (e) {
      warning(false, e.message)
    }
    let initialState
    this.unsubscriptions = []
    if (this.form) {
      this.unsubscriptions.push(
        this.form.subscribe((state: FormState) => {
          if (initialState) {
            this.notify(state)
          } else {
            initialState = state
          }
        }, subscription || all)
      )
    }
    this.state = { state: initialState }
    if (decorators) {
      decorators.forEach(decorator => {
        this.unsubscriptions.push(decorator(this.form))
      })
    }
  }

  getChildContext() {
    return {
      reactFinalForm: this.form
    }
  }

  notify = (state: FormState) => this.setState({ state })

  handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    return this.form.submit()
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!shallowEqual(this.props.initialValues, nextProps.initialValues)) {
      this.form.initialize(nextProps.initialValues)
    }
  }

  componentWillUnmount() {
    this.unsubscriptions.forEach(unsubscribe => unsubscribe())
  }

  render() {
    // remove config props
    const {
      debug,
      initialValues,
      mutators,
      onSubmit,
      subscription,
      validate,
      validateOnBlur,
      ...props
    } = this.props
    return renderComponent(
      {
        ...props,
        ...this.state.state,
        mutators: this.form && this.form.mutators,
        batch: this.form && this.form.batch,
        blur: this.form && this.form.blur,
        change: this.form && this.form.change,
        focus: this.form && this.form.focus,
        handleSubmit: this.handleSubmit,
        initialize: this.form && this.form.initialize,
        reset: this.form && this.form.reset
      },
      'ReactFinalForm'
    )
  }
}
