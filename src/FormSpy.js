// @flow
import * as React from 'react'
import warning from './warning'
import PropTypes from 'prop-types'
import { formSubscriptionItems } from 'final-form'
import diffSubscription from './diffSubscription'
import renderComponent from './renderComponent'
import type { FormSpyProps as Props, ReactContext } from './types'
import type { FormState } from 'final-form'
import { all } from './ReactFinalForm'

type State = { state: FormState }

export default class FormSpy extends React.Component<Props, State> {
  context: ReactContext
  props: Props
  state: State
  unsubscribe: () => void

  constructor(props: Props, context: ReactContext) {
    super(props, context)
    let initialState
    warning(
      context.reactFinalForm,
      'FormSpy must be used inside of a ReactFinalForm component'
    )
    if (this.context.reactFinalForm) {
      // avoid error, warning will alert developer to their mistake
      this.subscribe(props, (state: FormState) => {
        if (initialState) {
          this.notify(state)
        } else {
          initialState = state
          if (props.onChange) {
            props.onChange(state)
          }
        }
      })
    }
    if (initialState) {
      this.state = { state: initialState }
    }
  }

  subscribe = (
    { subscription }: Props,
    listener: (state: FormState) => void
  ) => {
    this.unsubscribe = this.context.reactFinalForm.subscribe(
      listener,
      subscription || all
    )
  }

  notify = (state: FormState) => {
    this.setState({ state })
    if (this.props.onChange) {
      this.props.onChange(state)
    }
  }

  componentWillReceiveProps(nextProps: Props) {
    const { subscription } = nextProps
    if (
      diffSubscription(
        this.props.subscription,
        subscription,
        formSubscriptionItems
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

  render() {
    const { onChange, subscription, ...rest } = this.props
    const { reactFinalForm } = this.context
    return onChange
      ? null
      : renderComponent(
          {
            ...rest,
            ...(this.state ? this.state.state : {}),
            mutators: reactFinalForm && reactFinalForm.mutators,
            batch: reactFinalForm && reactFinalForm.batch,
            blur: reactFinalForm && reactFinalForm.blur,
            change: reactFinalForm && reactFinalForm.change,
            focus: reactFinalForm && reactFinalForm.focus,
            initialize: reactFinalForm && reactFinalForm.initialize,
            reset: reactFinalForm && reactFinalForm.reset
          },
          'FormSpy'
        )
  }
}

FormSpy.contextTypes = {
  reactFinalForm: PropTypes.object
}
