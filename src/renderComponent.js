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
    return render({ ...rest, children }) // inject children back in
  }
  if (typeof children !== 'function') {
    // istanbul ignore next
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        `Warning: Must specify either a render prop, a render function as children, or a component prop to ${name}`
      )
    }
    return null // warning will alert developer to their mistake
  }
  return children(rest)
}
