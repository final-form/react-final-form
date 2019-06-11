// @flow
import * as React from 'react'
import type { FormApi, FormValuesShape } from 'final-form'

let instance: React.Context<?FormApi<any>>

export default function getContext<
  FormValues: FormValuesShape
>(): React.Context<FormApi<FormValues>> {
  if (!instance) {
    instance = React.createContext<?FormApi<FormValues>>()
  }
  return ((instance: any): React.Context<FormApi<FormValues>>)
}
