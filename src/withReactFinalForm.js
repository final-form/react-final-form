import * as React from 'react'
import useForm from './useForm'

const getDisplayName = Component => {
  const displayName = Component.displayName || Component.name || 'Component'
  return `ReactFinalForm(${displayName})`
}

const withReactFinalForm = Component => {
  const WithReactFinalFormComponent = props => {
    const form = useForm()
    return <Component reactFinalForm={form} {...props} />
  }
  WithReactFinalFormComponent.displayName = getDisplayName(Component)
  return WithReactFinalFormComponent
}

export default withReactFinalForm
