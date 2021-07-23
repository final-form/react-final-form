// @flow
import * as React from 'react'

/**
 * Creates a callback, with dependencies, that will be
 * instance === for the lifetime of the component.
 */
export default function useConstantCallback(callback, deps) {
  // initialize refs on first render
  const refs = deps.map(React.useRef)
  // update refs on each additional render
  deps.forEach((dep, index) => (refs[index].current = dep))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const constant = React.useRef((...args) => {
    // This if seems weird, but if args is [], then the
    // first param will be the refs.map()
    if (args && args.length) {
      callback(
        ...args,
        refs.map(ref => ref.current)
      )
    } else {
      callback(
        undefined,
        refs.map(ref => ref.current)
      )
    }
  }, [])
  return constant.current
}
