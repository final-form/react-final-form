// @flow
import * as React from 'react'
import flattenSubscription from './flattenSubscription'
import type { UseFormStateParams } from './types'
import type { FormState, FormApi } from 'final-form'
import { all } from './ReactFinalForm'
import useForm from './useForm'

const useFormState = ({
  onChange,
  subscription
}: UseFormStateParams = {}): FormState => {
  const form: FormApi = useForm('useFormState')
  const firstRender = React.useRef(true)

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FormState>(
    (): FormState => {
      let initialState: FormState = {}
      form.subscribe(state => {
        initialState = state
      }, subscription || all)()
      if (onChange) {
        onChange(initialState)
      }
      return initialState
    }
  )

  const flattenedSubscription = flattenSubscription(subscription || all)
  React.useEffect(
    () =>
      form.subscribe(newState => {
        if (firstRender.current) {
          firstRender.current = false
        } else {
          setState(newState)
          if (onChange) {
            onChange(newState)
          }
        }
      }, subscription || all),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    flattenedSubscription
  )
  return state
}

export default useFormState
