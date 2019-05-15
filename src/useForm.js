// @flow
import * as React from 'react'
import type { FormApi } from 'final-form'
import ReactFinalFormContext from './context'

const useForm = (componentName?: string): FormApi => {
  const form: ?FormApi = React.useContext(ReactFinalFormContext)
  if (!form) {
    throw new Error(
      `Warning: ${componentName ||
        'useForm'} must be used inside of a <Form> component`
    )
  }
  return form
}

export default useForm
