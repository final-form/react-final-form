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

type State = { state: FormState }

class FormSpy extends React.Component<Props, State> {
  props: Props
  state: State
  unsubscribe: () => void

  constructor(props: Props) {
    super(props)
    let initialState

    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production' && !this.props.reactFinalForm) {
      console.error(
        'Warning: FormSpy must be used inside of a ReactFinalForm component'
      )
    }

    if (this.props.reactFinalForm) {
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

  componentDidUpdate(prevProps: Props) {
    const { subscription } = this.props
    if (
      diffSubscription(
        prevProps.subscription,
        subscription,
        formSubscriptionItems
      )
    ) {
      if (this.props.reactFinalForm) {
        // avoid error, warning will alert developer to their mistake
        this.unsubscribe()
        this.subscribe(this.props, this.notify)
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  render() {
    const { onChange, reactFinalForm, ...rest } = this.props
    const renderProps: FormSpyRenderProps = {
      batch:
        reactFinalForm &&
        ((fn: () => void) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.batch() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.batch() instead. Check your FormSpy render prop.`
            )
          }
          return reactFinalForm.batch(fn)
        }),
      blur:
        reactFinalForm &&
        ((name: string) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.blur() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.blur() instead. Check your FormSpy render prop.`
            )
          }
          return reactFinalForm.blur(name)
        }),
      change:
        reactFinalForm &&
        ((name: string, value: any) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.change() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.change() instead. Check your FormSpy render prop.`
            )
          }
          return reactFinalForm.change(name, value)
        }),
      focus:
        reactFinalForm &&
        ((name: string) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.focus() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.focus() instead. Check your FormSpy render prop.`
            )
          }
          return reactFinalForm.focus(name)
        }),
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
      },
      initialize:
        reactFinalForm &&
        ((values: Object) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.initialize() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.initialize() instead. Check your FormSpy render prop.`
            )
          }
          return reactFinalForm.initialize(values)
        }),
      mutators:
        reactFinalForm &&
        Object.keys(reactFinalForm.mutators).reduce((result, key) => {
          result[key] = (...args) => {
            reactFinalForm.mutators[key](...args)
            // istanbul ignore next
            if (process.env.NODE_ENV !== 'production') {
              console.error(
                `Warning: As of React Final Form v3.3.0, props.mutators is deprecated and will be removed in the next major version of React Final Form. Use: props.form.mutators instead. Check your FormSpy render prop.`
              )
            }
          }
          return result
        }, {}),
      reset:
        reactFinalForm &&
        ((values?: Object) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.reset() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.reset() instead. Check your FormSpy render prop.`
            )
          }
          return reactFinalForm.reset(values)
        }),
      formName: reactFinalForm && (() => reactFinalForm.getFormName())
    }
    return onChange
      ? null
      : renderComponent(
          {
            ...rest,
            ...(this.state ? this.state.state : {}),
            ...renderProps
          },
          'FormSpy'
        )
  }
}

export default withReactFinalForm(FormSpy)
