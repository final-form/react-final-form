// @flow
import * as React from 'react'
import type { FormApi, FormValuesShape } from 'final-form'
import ReactFinalFormContext from './context'

function useForm<FormValues: FormValuesShape>(
  componentName?: string
): FormApi<FormValues> {
  const form: ?FormApi<FormValues> = React.useContext(ReactFinalFormContext)
  if (!form) {
    throw new Error(
      `${componentName || 'useForm'} must be used inside of a <Form> component`
    )
  }
  return form
}

export default useForm
