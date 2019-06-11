// @flow
import * as React from 'react'
import renderComponent from './renderComponent'
import type { FormSpyPropsWithForm as Props, FormSpyRenderProps } from './types'
import type { FormApi, FormValuesShape } from 'final-form'
import isSyntheticEvent from './isSyntheticEvent'
import useFormState from './useFormState'
import getContext from './getContext'

function FormSpy<FormValues: FormValuesShape>({
  onChange,
  subscription,
  ...rest
}: Props<FormValues>) {
  const ReactFinalFormContext = getContext<FormValues>()
  const reactFinalForm: ?FormApi<FormValues> = React.useContext(
    ReactFinalFormContext
  )
  if (!reactFinalForm) {
    throw new Error('FormSpy must be used inside of a ReactFinalForm component')
  }
  const state = useFormState({ onChange, subscription })
  if (onChange) {
    return null
  }

  const renderProps: FormSpyRenderProps<FormValues> = {
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
    {
      ...rest,
      ...state,
      ...renderProps
    },
    'FormSpy'
  )
}

export default FormSpy
