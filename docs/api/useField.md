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
