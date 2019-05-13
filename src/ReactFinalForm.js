// @flow
import * as React from 'react'
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
import type { FormProps as Props } from './types'
import renderComponent from './renderComponent'
import useWhenValueChanges from './useWhenValueChanges'
import shallowEqual from './shallowEqual'
import isSyntheticEvent from './isSyntheticEvent'
import type { FormRenderProps } from './types.js.flow'
import flattenSubscription from './flattenSubscription'
import ReactFinalFormContext from './context'

export const version = '4.1.0'

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
const validationStateChanged = (a: FormState, b: FormState) =>
  ['valid', 'invalid', 'errors'].some(key => !shallowEqual(a[key], b[key]))

const ReactFinalForm = ({
  debug,
  decorators,
  destroyOnUnregister,
  initialValues,
  initialValuesEqual,
  keepDirtyOnReinitialize,
  mutators,
  onSubmit,
  subscription,
  validate,
  validateOnBlur,
  ...rest
}: Props) => {
  const config: Config = {
    debug,
    destroyOnUnregister,
    initialValues,
    keepDirtyOnReinitialize,
    mutators,
    onSubmit,
    validate,
    validateOnBlur
  }
  const form = React.useRef<?FormApi>()
  if (!form.current) {
    try {
      form.current = createForm(config)
      form.current.pauseValidation()
    } catch (e) {
      // istanbul ignore next
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Warning: ${e.message}`)
      }
    }
  }

  const firstRender = React.useRef(true)

  // synchronously register and unregister to query form state for our subscription on first render
  const [state, setState] = React.useState<FormState>(
    (): FormState => {
      let initialState: FormState = {}
      if (form.current) {
        form.current.subscribe(state => {
          initialState = state
        }, subscription || all)()
      }
      return initialState
    }
  )

  const flattenedSubscription = flattenSubscription(subscription || all)
  React.useEffect(() => {
    // We have rendered, so all fields are no registered, so we can unpause validation
    form.current &&
      form.current.isValidationPaused() &&
      form.current.resumeValidation()
    const unsubscriptions: Unsubscribe[] = [
      form.current
        ? form.current.subscribe(s => {
            if (firstRender.current) {
              if (validationStateChanged(state, s)) {
                // this may happen if we have field-level validation
                setState(s)
              }
            } else {
              setState(s)
            }
            firstRender.current = false
          }, subscription || all)
        : () => {},
      ...(decorators
        ? decorators.map(decorator =>
            // this noop ternary is to appease the flow gods
            // istanbul ignore next
            form.current ? decorator(form.current) : () => {}
          )
        : [])
    ]

    return () => {
      unsubscriptions.forEach(unsubscribe => unsubscribe())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decorators, ...flattenedSubscription])

  // warn about decorator changes
  useWhenValueChanges(
    decorators,
    () => {
      console.error(
        'Warning: Form decorators should not change from one render to the next as new values will be ignored'
      )
    },
    // this env check short circuts the comparison in production
    // so we don't run the shallowEqual on every render
    // istanbul ignore next
    process.env.NODE_ENV === 'production' ? () => true : shallowEqual
  )

  // allow updatable config
  useWhenValueChanges(debug, () => {
    form.current && form.current.setConfig('debug', debug)
  })
  useWhenValueChanges(destroyOnUnregister, () => {
    form.current &&
      form.current.setConfig('destroyOnUnregister', destroyOnUnregister)
  })
  useWhenValueChanges(
    initialValues,
    () => {
      form.current && form.current.setConfig('initialValues', initialValues)
    },
    initialValuesEqual || shallowEqual
  )
  useWhenValueChanges(keepDirtyOnReinitialize, () => {
    form.current &&
      form.current.setConfig('keepDirtyOnReinitialize', keepDirtyOnReinitialize)
  })
  useWhenValueChanges(mutators, () => {
    form.current && form.current.setConfig('mutators', mutators)
  })
  useWhenValueChanges(onSubmit, () => {
    form.current && form.current.setConfig('onSubmit', onSubmit)
  })
  useWhenValueChanges(validate, () => {
    form.current && form.current.setConfig('validate', validate)
  })
  useWhenValueChanges(validateOnBlur, () => {
    form.current && form.current.setConfig('validateOnBlur', validateOnBlur)
  })

  const handleSubmit = (event: ?SyntheticEvent<HTMLFormElement>) => {
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
    return form.current && form.current.submit()
  }

  const renderProps: FormRenderProps = {
    // assign to force Flow check
    ...state,
    form: {
      ...form.current,
      reset: eventOrValues => {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          form.current && form.current.reset()
        } else {
          form.current && form.current.reset(eventOrValues)
        }
      }
    },
    handleSubmit
  }
  return React.createElement(
    ReactFinalFormContext.Provider,
    { value: form.current },
    renderComponent(
      {
        ...rest,
        ...renderProps,
        __versions: versions
      },
      'ReactFinalForm'
    )
  )
}

export default ReactFinalForm
