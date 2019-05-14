// @flow
import React from 'react'

/**
 * A simple hook to create a constant value that lives for
 * the lifetime of the component.
 *
 * Plagiarized from https://github.com/Andarist/use-constant
 *
 * Do NOT reuse this code unless you know what you're doing.
 * Use Andarist's hook; it's more fault tolerant to things like
 * falsy values.
 *
 * @param {Function} init - A function to generate the value
 */
export default function useConstant<T>(init: () => T): T {
  const ref = React.useRef<?T>()
  if (!ref.current) {
    ref.current = init()
  }
  return ref.current
}
