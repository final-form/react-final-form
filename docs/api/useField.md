# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/api/useField). Links may not work on Github.com.

# `useField()`

```ts
import { useField } from 'react-final-form'
```

<!-- prettier-ignore -->
```ts
(name: string, config: UseFieldConfig) => FieldRenderProps
```

The `useField()` hook takes two parameters:

### `name`

```ts
string
```

**Required**

The name of the field.

### `config`

```ts
UseFieldConfig
```

Optional.

An object that looks just like [`FieldProps`](../types/FieldProps), except without the name.

`useField()` returns [`FieldRenderProps`](../types/FieldRenderProps). It will manage the rerendering of any component you use it in, i.e. the component will only rerender if the field state subscribed to via `useField()` changes.

`useField()` is used internally inside [`<Field/>`](Field).


## Example 

```ts
import { useForm, useField } from 'react-final-form-hooks'

const MyForm = () => {
  const { form, handleSubmit, values, pristine, submitting } = useForm({
    onSubmit, // the function to call with your form values upon valid submit
    validate // a record-level validation function to check all form values
  })
  const firstName = useField('firstName', form)
  const lastName = useField('lastName', form)
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name</label>
        <input {...firstName.input} placeholder="First Name" />
        {firstName.meta.touched && firstName.meta.error && (
          <span>{firstName.meta.error}</span>
        )}
      </div>
      <div>
        <label>Last Name</label>
        <input {...lastName.input} placeholder="Last Name" />
        {lastName.meta.touched && lastName.meta.error && (
          <span>{lastName.meta.error}</span>
        )}
      </div>
      <button type="submit" disabled={pristine || submitting}>
        Submit
      </button>
    </form>
  )
}

```
