// @flow
import * as React from 'react'
import type { RenderableProps } from './types'

// shared logic between components that use either render prop,
// children render function, or component prop
export default function renderComponent<T>(
  props: RenderableProps<T> & T,
  name: string
): React.Node {
  const { render, children, component, ...rest } = props
  if (component) {
    return React.createElement(component, { ...rest, children, render })
  }
  if (render) {
    return render(children === undefined ? rest : { ...rest, children }) // inject children back in
  }
  if (typeof children !== 'function') {
    throw new Error(
      `Must specify either a render prop, a render function as children, or a component prop to ${name}`
    )
  }
  return children(rest)
}
