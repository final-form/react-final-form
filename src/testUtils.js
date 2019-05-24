import React from 'react'

export const wrapWith = (mock, fn) => (...args) => {
  mock(...args)
  return fn(...args)
}

/** A simple container component that allows boolean to be toggled with a button */
export function Toggle({ children }) {
  const [on, setOn] = React.useState(false)
  return (
    <div>
      {children(on)}
      <button onClick={() => setOn(!on)}>Toggle</button>
    </div>
  )
}

export class ErrorBoundary extends React.Component {
  componentDidCatch(error) {
    this.props.spy(error)
  }

  render() {
    return this.props.children
  }
}
