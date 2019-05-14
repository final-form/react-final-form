// @flow
import React from 'react'

export default function useWhenValueChanges(
  value: any,
  callback: () => void,
  isEqual: (any, any) => boolean = (a, b) => a === b
) {
  const previous = React.useRef(value)
  React.useEffect(() => {
    if (!isEqual(value, previous.current)) {
      callback()
      previous.current = value
    }
  })
}
