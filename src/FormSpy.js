// @flow
import * as React from 'react'
import { formSubscriptionItems } from 'final-form'
import diffSubscription from './diffSubscription'
import renderComponent from './renderComponent'
import type { FormSpyPropsWithForm as Props, FormSpyRenderProps } from './types'
import type { FormState } from 'final-form'
import isSyntheticEvent from './isSyntheticEvent'
import { all } from './ReactFinalForm'
import { withReactFinalForm } from './reactFinalFormContext'

type State = {
  state: ?FormState,
  mounted: boolean
}

class FormSpy extends React.Component<Props, State> {
  props: Props
  state: State = { state: undefined, mounted: false }
  unsubscribe: () => void

  constructor(props: Props) {
    super(props)

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production' && !this.props.reactFinalForm) {
      console.error(
        'Warning: FormSpy must be used inside of a ReactFinalForm component'
      )
    }
  }

  subscribe = (
    { subscription }: Props,
    listener: (state: FormState) => void
  ) => {
    this.unsubscribe = this.props.reactFinalForm.subscribe(
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

  componentDidMount() {
    if (this.props.reactFinalForm) {
      // avoid error, warning will alert developer to their mistake
      this.subscribe(this.props, this.notify)
    }
    this.setState({ mounted: true })
  }

  componentDidUpdate(prevProps: Props) {
    const { subscription } = this.props
    if (
      this.props.reactFinalForm &&
      diffSubscription(
        prevProps.subscription,
        subscription,
        formSubscriptionItems
      )
    ) {
      // avoid error, warning will alert developer to their mistake
      this.unsubscribe()
      this.subscribe(this.props, this.notify)
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    if (!this.state.mounted) {
      // If is in form, but hasn't been mounted yet, don't render anything.
      // This will re-render from `componentDidMount` and flush within the same tick.
      return null
    } else if (this.props.onChange) {
      // `onChange` is provided, so nothing is to be rendered
      return null
    }

    const { onChange, reactFinalForm, ...rest } = this.props
    const renderProps: FormSpyRenderProps = {
      form: {
        ...reactFinalForm,
        reset: eventOrValues => {
          if (isSyntheticEvent(eventOrValues)) {
            // it's a React SyntheticEvent, call reset with no arguments
            reactFinalForm.reset()
          } else {
            reactFinalForm.reset(eventOrValues)
          }
        }
      }
    }
    return renderComponent(
      { ...rest, ...this.state.state, ...renderProps },
      'FormSpy'
    )
  }
}

export default withReactFinalForm(FormSpy)
