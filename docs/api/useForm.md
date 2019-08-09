# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/api/useForm). Links may not work on Github.com.

# `useForm()`

```ts
import { useForm } from 'react-final-form'
```

<!-- prettier-ignore -->
```ts
() => FormApi
```

The `useForm()` hook plucks the [`FormApi`](/docs/final-form/types/FormApi) out of the React context for you. It will throw an exception if you try to use it outside of a [`<Form/>`](Form) component.

`useForm()` is used internally inside [`useField()`](useField), [`<Field/>`](Field), and [`<FormSpy/>`](FormSpy).
