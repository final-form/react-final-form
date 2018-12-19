import * as React from 'react'

export const ReactFinalFormContext = React.createContext(null)

export const withReactFinalForm = Component => {
  return class extends React.Component {
    static displayName = `withReactFinalForm(${Component.displayName ||
      Component.name})`

    render() {
      return React.createElement(ReactFinalFormContext.Consumer, {
        children: reactFinalForm =>
          React.createElement(Component, {
            reactFinalForm,
            ...this.props
          })
      })
    }
  }
}
