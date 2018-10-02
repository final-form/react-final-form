// @flow
import * as React from 'react'
import PropTypes from 'prop-types'
import {
  configOptions,
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
import isSyntheticEvent from './isSyntheticEvent'
import type { FormRenderProps } from './types.js.flow'
export const version = '3.6.0'

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
  state: FormState
}

class ReactFinalForm extends React.Component<Props, State> {
  context: ReactContext
  props: Props
  state: State
  form: FormApi
  mounted: boolean
  resumeValidation: ?boolean
  unsubscriptions: Unsubscribe[]

  static childContextTypes = {
    reactFinalForm: PropTypes.object
  }

  constructor(props: Props) {
    super(props)
    const {
      children,
      component,
      render,
      subscription,
      decorators,
      ...rest
    } = props
    const config: Config = rest
    this.mounted = false
    try {
      this.form = createForm(config)
    } catch (e) {
      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Warning: ${e.message}`)
      }
    }
    this.unsubscriptions = []
    if (this.form) {
      // set initial state
      let initialState: FormState = {}
      this.form.subscribe((state: FormState) => {
        initialState = state
      }, subscription || all)()
      this.state = { state: initialState }
    }
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

  notify = (state: FormState) => {
    if (this.mounted) {
      this.setState({ state })
    }
    this.mounted = true
  }

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

  componentWillMount() {
    if (this.form) {
      this.form.pauseValidation()
    }
  }

  componentDidMount() {
    if (this.form) {
      this.unsubscriptions.push(
        this.form.subscribe(this.notify, this.props.subscription || all)
      )
      this.form.resumeValidation()
    }
  }

  componentWillUpdate() {
    // istanbul ignore next
    if (this.form) {
      this.resumeValidation =
        this.resumeValidation || !this.form.isValidationPaused()
      this.form.pauseValidation()
    }
  }

  componentDidUpdate(prevProps: Props) {
    // istanbul ignore next
    if (this.form && this.resumeValidation) {
      this.form.resumeValidation()
    }
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
    const renderProps: FormRenderProps = {
      // assign to force Flow check
      ...(this.state ? this.state.state : {}),
      batch:
        this.form &&
        ((fn: () => void) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.batch() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.batch() instead. Check your ReactFinalForm render prop.`
            )
          }
          return this.form.batch(fn)
        }),
      blur:
        this.form &&
        ((name: string) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.blur() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.blur() instead. Check your ReactFinalForm render prop.`
            )
          }
          return this.form.blur(name)
        }),
      change:
        this.form &&
        ((name: string, value: any) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.change() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.change() instead. Check your ReactFinalForm render prop.`
            )
          }
          return this.form.change(name, value)
        }),
      focus:
        this.form &&
        ((name: string) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.focus() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.focus() instead. Check your ReactFinalForm render prop.`
            )
          }
          return this.form.focus(name)
        }),
      form: {
        ...this.form,
        reset: eventOrValues => {
          if (isSyntheticEvent(eventOrValues)) {
            // it's a React SyntheticEvent, call reset with no arguments
            this.form.reset()
          } else {
            this.form.reset(eventOrValues)
          }
        }
      },
      handleSubmit: this.handleSubmit,
      initialize:
        this.form &&
        ((values: Object) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.initialize() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.initialize() instead. Check your ReactFinalForm render prop.`
            )
          }
          return this.form.initialize(values)
        }),
      mutators:
        this.form &&
        Object.keys(this.form.mutators).reduce((result, key) => {
          result[key] = (...args) => {
            this.form.mutators[key](...args)
            // istanbul ignore next
            if (process.env.NODE_ENV !== 'production') {
              console.error(
                `Warning: As of React Final Form v3.3.0, props.mutators is deprecated and will be removed in the next major version of React Final Form. Use: props.form.mutators instead. Check your ReactFinalForm render prop.`
              )
            }
          }
          return result
        }, {}),
      reset:
        this.form &&
        ((values?: Object) => {
          // istanbul ignore next
          if (process.env.NODE_ENV !== 'production') {
            console.error(
              `Warning: As of React Final Form v3.3.0, props.reset() is deprecated and will be removed in the next major version of React Final Form. Use: props.form.reset() instead. Check your ReactFinalForm render prop.`
            )
          }
          return this.form.reset(values)
        })
    }
    return renderComponent(
      {
        ...props,
        ...renderProps,
        __versions: versions
      },
      'ReactFinalForm'
    )
  }
}

export default ReactFinalForm
