import * as React from 'react'

export const ReactFinalFormContext = React.createContext({
  form: null
})

export const withReactFinalForm = Component => {
  return class extends React.Component {
    render() {
      return React.createElement(ReactFinalFormContext.Consumer, {
        children: ({ reactFinalForm }) =>
          React.createElement(Component, {
            reactFinalForm,
            ...this.props
          })
      })
    }
  }
}
