// @flow
import * as React from 'react'
import type { FormApi } from 'final-form'

// This is dumb, but it's getting around a flow error, so...
type Maybe<T> = T | void

export default React.createContext<Maybe<FormApi>>(undefined)
