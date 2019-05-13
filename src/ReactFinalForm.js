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
import useConstant from './useConstant'
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

  const form: FormApi = useConstant(() => {
    const f = createForm(config)
    f.pauseValidation()
    return f
  })
  const firstRender = React.useRef(true)

  // synchronously register and unregister to query form state for our subscription on first render
  const [state, setState] = React.useState<FormState>(
    (): FormState => {
      let initialState: FormState = {}
      form.subscribe(state => {
        initialState = state
      }, subscription || all)()
      return initialState
    }
  )

  const flattenedSubscription = flattenSubscription(subscription || all)
  React.useEffect(() => {
    // We have rendered, so all fields are no registered, so we can unpause validation
    form.isValidationPaused() && form.resumeValidation()
    const unsubscriptions: Unsubscribe[] = [
      form.subscribe(s => {
        if (firstRender.current) {
          if (validationStateChanged(state, s)) {
            // this may happen if we have field-level validation
            setState(s)
          }
        } else {
          setState(s)
        }
        firstRender.current = false
      }, subscription || all),
      ...(decorators
        ? decorators.map(decorator =>
            // this noop ternary is to appease the flow gods
            // istanbul ignore next
            decorator(form)
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
    form.setConfig('debug', debug)
  })
  useWhenValueChanges(destroyOnUnregister, () => {
    form.setConfig('destroyOnUnregister', destroyOnUnregister)
  })
  useWhenValueChanges(
    initialValues,
    () => {
      form.setConfig('initialValues', initialValues)
    },
    initialValuesEqual || shallowEqual
  )
  useWhenValueChanges(keepDirtyOnReinitialize, () => {
    form.setConfig('keepDirtyOnReinitialize', keepDirtyOnReinitialize)
  })
  useWhenValueChanges(mutators, () => {
    form.setConfig('mutators', mutators)
  })
  useWhenValueChanges(onSubmit, () => {
    form.setConfig('onSubmit', onSubmit)
  })
  useWhenValueChanges(validate, () => {
    form.setConfig('validate', validate)
  })
  useWhenValueChanges(validateOnBlur, () => {
    form.setConfig('validateOnBlur', validateOnBlur)
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
    return form.submit()
  }

  const renderProps: FormRenderProps = {
    // assign to force Flow check
    ...state,
    form: {
      ...form,
      reset: eventOrValues => {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          form.reset()
        } else {
          form.reset(eventOrValues)
        }
      }
    },
    handleSubmit
  }
  return React.createElement(
    ReactFinalFormContext.Provider,
    { value: form },
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
