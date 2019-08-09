# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/types/FormProps). Links may not work on Github.com.

# `FormProps`

These are the props that you pass to [`<Form/>`](../api/Form). You must provide one of the ways to render: `component`, `render`, or `children`. The rest are mostly just passed along to Final Form's [`Config`](/docs/final-form/types/Config).

## `children`

```ts
((props: FormRenderProps) => React.Node) | React.Node`
```

Optional. (if you specify [`component`](#component) or [`render`](#render))

A render function that is given [`FormRenderProps`](FormRenderProps), as well as any non-API props passed into the `<Form/>` component. For example, if you did...

```tsx
<Form onSubmit={onSubmit} someArbitraryOtherProp={42}>
  {props => {
    console.log(props.someArbitraryOtherProp) // would print 42
    return <form onSubmit={props.handleSubmit}> ... </form>
  }}
</Form>
```

Note that if you specify [`render`](#render) _and_ `children`, `render` will be called, with `children` injected as if it were an additional prop.

Related:

- [`FormRenderProps`](FormRenderProps)

## `component`

```ts
React.ComponentType<FormRenderProps>
```

Optional. It is recommended that you use [`children`](#children) or [`render`](#render).

A component that is given [`FormRenderProps`](FormRenderProps) as props, as well as any non-API props passed into the [`<Form/>`](../api/Form) component. For example, if you did...

<!-- prettier-ignore -->
```tsx
<Form
  onSubmit={onSubmit}
  component={MyFormComp}
  someArbitraryOtherProp={42} />

const MyFormComp = props => {
  console.log(props.someArbitraryOtherProp) // would print 42
  return <form onSubmit={props.handleSubmit}> ... </form>
}
```

Note that your component will be rendered using [`React.createElement()`](https://reactjs.org/docs/react-api.html#createelement) resulting in your component actually being in the React node tree, i.e. inspectable in [DevTools](https://github.com/facebook/react-devtools#react-developer-tools-).

Related:

- [`FormRenderProps`](FormRenderProps)

## `debug`

```ts
(
  state: FormState,
  fieldStates: { [string]: FieldState }
) => void
```

Optional.

A callback for debugging that receives the form state and the states of
all the fields. It's called _on every state change_. A typical thing to pass in
might be `console.log`.

Related:

- [`FormState`](/docs/final-form/types/FormState)
- [`FieldState`](/docs/final-form/types/FieldState)

## `decorators`

```ts
Decorator[]
```

Optional.

An array of decorators to apply to the form. [`<Form/>`](../api/Form) will undecorate the form on unmount.

Related:

- [`Decorator`](/docs/final-form/types/Decorator)

## `form`

```ts
FormApi
```

Optional. _Advanced Usage_

If you'd like to construct your own Final Form `form` instance using [`createForm()`](/docs/final-form/api#createform), you may do so and pass it into [`<Form/>`](../api/Form) as a prop. Doing so will ignore all the other config props.

Related:

- [`FormApi`](/docs/final-form/types/FormApi)

## `initialValues`

```ts
FormValues | Object
```

Optional.

The initial values of your form. These will also be used to compare against the
current values to calculate `pristine` and `dirty`.

If you are using Typescript, these values must be the same type as the object given to your [`onSubmit`](#onsubmit) function.

## `initialValuesEqual`

```ts
(Object | undefined, Object | undefined) => boolean
```

Optional.

A predicate to determine whether or not the [`initialValues`](#initialvalues) prop has changed, i.e. to know if the form needs to be reinitialized with the new values. Useful for passing in a "deep equals" function if you need to. Defaults to "shallow equals".

## `keepDirtyOnReinitialize`

```ts
boolean
```

Optional.

If `true`, only pristine values will be overwritten when `initialize(newValues)` is called. This can be useful for allowing a user to continue to edit a record while the record is being saved asynchronously, and the form is reinitialized to the saved values when the save is successful. Defaults to `false`.

## `mutators`

```ts
{ [string]: Mutator }
```

Optional.

Named mutator functions.

Related:

- [Mutator](/docs/final-form/types/Mutator)

## `onSubmit`

```ts
(
  values: FormValues,
  form: FormApi,
  callback: ?(errors: ?Object) => void
) => ?Object | Promise<?Object> | void
```

**Required.**

Function to call when the form is submitted. There are three possible ways to
write an `onSubmit` function:

### 1. Synchronous

Returns `undefined` on success, or an `Object` of submission errors on failure.

### 2. Asynchronous with a callback

Returns `undefined`, calls `callback()` with no arguments on success, or with an `Object` of submission errors on failure.

### 3. Asynchronous with a `Promise`

Returns a `Promise<?Object>` that resolves with no value on success or _resolves_ with an `Object` of submission errors on failure. The reason it _resolves_ with errors is to leave rejection for when there is a server or communications error.

### Submission Errors

Submission errors must be in the same shape as the values of the form. You may
return a generic error for the whole form (e.g. `'Login Failed'`) using the
special [`FORM_ERROR`](/docs/final-form/api#form_error) string key.

Related:

- [`FormApi`](/docs/final-form/types/FormApi)

## `render`

<!-- prettier-ignore -->
```ts
(props: FormRenderProps) => React.Node
```

Optional. (if you specify [`component`](#component) or [`children`](#children))

A render function that is given [`FormRenderProps`](FormRenderProps), as well as any non-API props passed into the `<Form/>` component. For example, if you did...

```tsx
<Form
  onSubmit={onSubmit}
  someArbitraryOtherProp={42}
  render={props => {
    console.log(props.someArbitraryOtherProp) // would print 42
    return <form onSubmit={props.handleSubmit}> ... </form>
  }}
/>
```

Note that if you specify `render` _and_ [`children`](#children), `render` will be called, with `children` injected as if it were an additional prop.

Related:

- [`FormRenderProps`](FormRenderProps)

## `subscription`

```ts
{ [string]: boolean }
```

Optional. _Advanced Usage_

An object of the parts of [`FormState`](/docs/final-form/types/FormState) to subscribe to. If a subscription is provided, the [`<Form/>`](../api/Form) will only rerender when those parts of form state change.

If no `subscription` is provided, it will default to subscribing to _all_ form state changes. i.e. [`<Form/>`](../api/Form) will rerender whenever any part of the form state changes.

Related:

- [`FormState`](/docs/final-form/types/FormState)

## `validate`

```ts
(values: FormValues) => Object | Promise<Object>
```

Optional.

A whole-record validation function that takes all the values of the form and returns any validation errors. There are two possible ways to write a `validate` function:

### 1. Synchronous

Returns `{}` or `undefined` when the values are valid, or an `Object` of validation errors when the values are invalid.

### 2. Asynchronous with a `Promise`

Returns a `Promise<?Object>` that resolves with no value on success or _resolves_ with an `Object` of validation errors on failure. The reason it _resolves_ with errors is to leave _rejection_ for when there is a server or communications error.

### Validation Errors

Validation errors must be in the same shape as the values of the form. You may return a generic error for the whole form using the special [`FORM_ERROR`](/docs/final-form/api#form_error) string key.

## `validateOnBlur`

```ts
boolean
```

Optional.

If `true`, validation will happen on blur. If `false`, validation will happen on change. Defaults to `false`.
