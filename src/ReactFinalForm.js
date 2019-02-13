// @flow
import * as React from 'react'
import {
  configOptions,
  createForm,
  formSubscriptionItems,
  version as ffVersion
} from 'final-form'
import type {
  Config,
  FormApi,
  FormSubscription,
  FormState,
  Unsubscribe
} from 'final-form'
import type { FormProps as Props } from './types'
import shallowEqual from './shallowEqual'
import renderComponent from './renderComponent'
import isSyntheticEvent from './isSyntheticEvent'
import type { FormRenderProps } from './types.js.flow'
import { ReactFinalFormContext } from './reactFinalFormContext'

export const version = '4.0.2'

const versions = {
  'final-form': ffVersion,
  'react-final-form': version
}

export const all: FormSubscription = formSubscriptionItems.reduce(
  (result, key) => {
    result[key] = true
    return result
  },
  {}
)

type State = {
  state: ?FormState,
  mounted: boolean
}

class ReactFinalForm extends React.Component<Props, State> {
  props: Props
  state: State = { state: undefined, mounted: false }
  form: FormApi
  unsubscriptions: Unsubscribe[] = []

  notify = (state: FormState) => this.setState({ state })

  handleSubmit = (event: ?SyntheticEvent<HTMLFormElement>) => {
    if (event) {
      // sometimes not true, e.g. React Native
      if (typeof event.preventDefault === 'function') {
        event.preventDefault()
      }
      if (typeof event.stopPropagation === 'function') {
        // prevent any outer forms from receiving the event too
        event.stopPropagation()
      }
    }
    return this.form.submit()
  }

  componentDidMount() {
    const {
      children,
      component,
      render,
      subscription,
      decorators,
      ...rest
    } = this.props
    const config: Config = rest

    try {
      const form = createForm(config)
      form.pauseValidation()

      this.form = {
        ...form,
        reset: eventOrValues => {
          if (isSyntheticEvent(eventOrValues)) {
            // it's a React SyntheticEvent, call reset with no arguments
            form.reset()
          } else {
            form.reset(eventOrValues)
          }
        }
      }

      const { decorators = [], subscription = all } = this.props
      this.unsubscriptions.push(
        ...decorators.map(decorator => decorator(this.form))
      )
      this.unsubscriptions.push(this.form.subscribe(this.notify, subscription))
    } catch (e) {
      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Warning: ${e.message}`)
      }
    }

    this.setState({ mounted: true })
  }

  fieldsMounted: boolean = false
  componentDidUpdate(prevProps: Props, prevState: State) {
    if (!this.fieldsMounted) {
      this.fieldsMounted = true
      if (this.form) {
        this.form.resumeValidation()
      }
      return
    }

    if (this.props === prevProps) {
      // Ignore `setState` updates
      return
    }

    if (!this.form) {
      // avoid error, warning will alert developer to their mistake
      return
    }

    this.form.pauseValidation()

    if (
      this.props.initialValues &&
      !(this.props.initialValuesEqual || shallowEqual)(
        prevProps.initialValues,
        this.props.initialValues
      )
    ) {
      this.form.initialize(this.props.initialValues)
    }

    configOptions.forEach(key => {
      if (key === 'initialValues' || prevProps[key] === this.props[key]) {
        return
      }
      this.form.setConfig(key, this.props[key])
    })

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production') {
      if (!shallowEqual(prevProps.decorators, this.props.decorators)) {
        console.error(
          'Warning: Form decorators should not change from one render to the next as new values will be ignored'
        )
      }
      if (!shallowEqual(prevProps.subscription, this.props.subscription)) {
        console.error(
          'Warning: Form subscription should not change from one render to the next as new values will be ignored'
        )
      }
    }

    this.form.resumeValidation()
  }

  componentWillUnmount() {
    this.unsubscriptions.forEach(unsubscribe => unsubscribe())
  }

  render() {
    if (!this.state.mounted) {
      // Not yet mounted and subscribed to the form.
      return null
    }

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

    // assign to force Flow check
    const renderProps: FormRenderProps = {
      ...this.state.state,
      form: this.form,
      handleSubmit: this.handleSubmit
    }

    return React.createElement(
      ReactFinalFormContext.Provider,
      { value: this.form },
      renderComponent(
        {
          ...props,
          ...renderProps,
          __versions: versions
        },
        'ReactFinalForm'
      )
    )
  }
}

export default ReactFinalForm
