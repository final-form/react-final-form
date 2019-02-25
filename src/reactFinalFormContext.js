import * as React from 'react'

export const ReactFinalFormContext = React.createContext(null)

export const getDisplayName = Component => {
  const displayName = Component.displayName || Component.name || 'Component'

  return `ReactFinalForm(${displayName})`
}

export const withReactFinalForm = Component => {
  return class extends React.Component {
    static displayName = getDisplayName(Component)

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
