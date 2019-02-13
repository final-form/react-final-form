import * as React from 'react'

export const ReactFinalFormContext = React.createContext(null)

export const withReactFinalForm = Component => props => {
  return React.createElement(ReactFinalFormContext.Consumer, {
    children: reactFinalForm =>
      React.createElement(Component, { reactFinalForm, ...props })
  })
}
