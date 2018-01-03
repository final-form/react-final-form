import * as React from 'react'
import {
  FormApi,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldSubscription
} from 'final-form'

export type ReactContext = {
  reactFinalForm: FormApi
}

export type FieldRenderProps = {
  input: {
    name: string
    onBlur: <T>(event?: React.FocusEvent<T>) => void
    onChange: <T>(event: React.ChangeEvent<T> | any) => void
    onFocus: <T>(event?: React.FocusEvent<T>) => void
    value: any
  }
  meta: Partial<{
    // TODO: Make a diff of `FieldState` without all the functions
    active: boolean
    dirty: boolean
    error: boolean
    initial: boolean
    invalid: boolean
    pristine: boolean
    submitError: boolean
    submitFailed: boolean
    submitSucceeded: boolean
    touched: boolean
    valid: boolean
    visited: boolean
  }>
}

export type FormRenderProps = {
  batch: (fn: () => void) => void
  blur: (name: string) => void
  change: (name: string, value: any) => void
  focus: (name: string) => void
  handleSubmit: (event?: React.SyntheticEvent<HTMLFormElement>) => void
  initialize: (values: object) => void
  mutators?: { [key: string]: Function }
  reset: () => void
} & FormState

export type FormSpyRenderProps = FormState

export type RenderableProps<T> = Partial<{
  children: ((props: T) => React.ReactNode) | React.ReactNode
  component: React.ComponentType<FieldRenderProps> | string
  render: (props: T) => React.ReactNode
}>

export type FormProps = {
  subscription?: FormSubscription
  decorators?: Decorator[]
} & Config &
  RenderableProps<FormRenderProps>

export type FieldProps = {
  allowNull?: boolean
  format?: ((value: any, name: string) => any) | null
  parse?: ((value: any, name: string) => any) | null
  name: string
  subscription?: FieldSubscription
  validate?: (value: any, allValues: object) => any
  value?: any
  [otherProp: string]: any
} & RenderableProps<FieldRenderProps>

export type FormSpyProps = {
  onChange?: (formState: FormState) => void
  subscription?: FormSubscription
} & RenderableProps<FormSpyRenderProps>

export var Field: React.ComponentType<FieldProps>
export var Form: React.ComponentType<FormProps>
export var FormSpy: React.ComponentType<FormSpyProps>
export var version: string
