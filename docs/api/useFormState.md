# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/api/useFormState). Links may not work on Github.com.

# `useFormState`

```ts
import { useFormState } from 'react-final-form'
```

The `useFormState()` hook takes one optional parameter, which matches the exact shape of [`FormSpyProps`](../types/FormSpyProps) (except without the render props). It returns a [`FormState`](/docs/final-form/types/FormState).

`useFormState()` is used internally inside [`<FormSpy/>`](FormSpy).
