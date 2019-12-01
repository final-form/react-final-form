import type { FormState, FieldState } from 'final-form'

const addLazyState = (dest: Object, state: Object, keys: string[]): void => {
  keys.forEach(key => {
    Object.defineProperty(dest, key, {
      get: () => state[key],
      enumerable: true
    })
  })
}

export const addLazyFormState = (dest: Object, state: FormState): void =>
  addLazyState(dest, state, [
    'active',
    'dirty',
    'dirtyFields',
    'dirtySinceLastSubmit',
    'dirtyFieldsSinceLastSubmit',
    'error',
    'errors',
    'hasSubmitErrors',
    'hasValidationErrors',
    'initialValues',
    'invalid',
    'modified',
    'pristine',
    'submitError',
    'submitErrors',
    'submitFailed',
    'submitSucceeded',
    'submitting',
    'touched',
    'valid',
    'validating',
    'values',
    'visited'
  ])

export const addLazyFieldMetaState = (dest: Object, state: FieldState): void =>
  addLazyState(dest, state, [
    'active',
    'data',
    'dirty',
    'dirtySinceLastSubmit',
    'error',
    'initial',
    'invalid',
    'length',
    'modified',
    'pristine',
    'submitError',
    'submitFailed',
    'submitSucceeded',
    'submitting',
    'touched',
    'valid',
    'validating',
    'visited'
  ])
