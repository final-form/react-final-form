# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/types/FieldRenderProps). Links may not work on Github.com.

# `FieldRenderProps`

These are the props that [`<Field/>`](../api/Field) provides to your render function or component.

This object separates out the values and event handlers intended to be given to the input component from the `meta` data about the field. The `input` can be destructured directly into an `<input/>` like so: `<input {...props.input}/>`. Keep in mind that **the values in `meta` are dependent on you having subscribed to them** with the [`subscription`](FieldProps#subscription) prop.

## `input.name`

```ts
string
```

**Required**

The name of the field.

## `input.onBlur`

```ts
(?SyntheticFocusEvent<*>) => void`
```

**Required**

The `onBlur` function can take a `SyntheticFocusEvent` like it would if you had given it directly to an `<input/>` component, but you can also just call it: `props.input.onBlur()` to mark the field as blurred (inactive).

Related:

- [`SyntheticFocusEvent`](https://reactjs.org/docs/events.html#focus-events)

## `input.onChange`

```ts
(SyntheticInputEvent<*> | any) => void
```

**Required**

The `onChange` function can take a `SyntheticInputEvent` like it would if you had given it directly to an `<input/>` component (in which case it will read the value out of `event.target.value`), but you can also just call it: `props.input.onChange(value)` to update the value of the field.

Related:

- [`SyntheticInputEvent`](https://reactjs.org/docs/events.html#form-events)

## `input.onFocus`

```ts
(?SyntheticFocusEvent<*>) => void
```

**Required**

The `onFocus` function can take a `SyntheticFocusEvent` like it would if you had given it directly to an `<input/>` component, but you can also just call it: `props.input.onFocus()` to mark the field as focused (active).

Related:

- [`SyntheticFocusEvent`](https://reactjs.org/docs/events.html#focus-events)

## `input.value`

```ts
any
```

Optional. May not be present if you have not [subscribed](FieldProps#subscription) to `value`.

The current value of the field.

## `meta.active`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `active`.

Whether or not the field currently has focus.

## `meta.data`

A place for arbitrary values to be placed by mutators.

## `meta.dirty`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `dirty`.

`true` when the value of the field is not equal to the initial value (using the [`isEqual`](FieldProps#isequal) comparator provided to `<Field/>`), `false` if the values are equal.

## `meta.dirtySinceLastSubmit`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `dirtySinceLastSubmit`.

`true` when the value of the field is not equal to the value last submitted (using the [`isEqual`](FieldProps#isequal) comparator provided to `<Field/>`), `false` if the values are equal.

## `meta.error`

```ts
any
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `error`.

The current validation error for this field.

## `meta.initial`

```ts
any
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `initial`.

The initial value of the field. `undefined` if it was never initialized.

## `meta.invalid`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `invalid`.

`true` if the field has a validation error or a submission error. `false` otherwise.

## `meta.modified`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `modified`.

`true` if this field's value has ever been changed. `false` otherwise.

Once `true`, it will remain `true` for the lifetime of the field, or until the form is reset.

## `meta.modifiedSinceLastSubmit`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `modifiedSinceLastSubmit`.

`true` if this field's value has ever been changed since last submission. `false` otherwise.

Once `true`, it will remain `true` until the next submit action, or until the form is reset.

## `meta.pristine`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `pristine`.

`true` if the current value is `===` to the initial value, `false` if the values are `!==`.

## `meta.submitError`

```ts
any
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `submitError`.

The submission error for this field.

## `meta.submitFailed`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `submitFailed`.

`true` if a form submission has been tried and failed. `false` otherwise.

## `meta.submitSucceeded`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `submitSucceeded`.

`true` if the form has been successfully submitted. `false` otherwise.

## `meta.submitting`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `submitting`.

`true` if the form is currently being submitted asynchronously. `false` otherwise.

## `meta.touched`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `touched`.

`true` if this field has ever gained and lost focus. `false` otherwise.

Useful for knowing when to display error messages.

## `meta.valid`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `valid`.

`true` if this field has no validation or submission errors. `false` otherwise.

## `meta.validating`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `validating`.

`true` if this field is currently waiting on its asynchronous field-level validation function to resolve. `false` otherwise.

## `meta.visited`

```ts
boolean
```

Optional: May not be present if you have not [subscribed](FieldProps#subscription) to `visited`.

`true` if this field has ever gained focus. `false` otherwise.
