// @flow
import React from 'react'

export default function useLatest<T>(value: T): { +current: T } {
  const ref = React.useRef(value)

  React.useEffect(() => {
    ref.current = value
  })

  return ref
}
