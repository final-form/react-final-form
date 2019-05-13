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
    }
    // We really only care if value changes, as callback doesn't change.
    // This would not be safe to release as a custom hook for public
    // consumption, but because we know the specific uses in this library,
    // we know that we can ignore changes to isEqual and callback

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
}
