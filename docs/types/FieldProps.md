# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/types/FieldProps). Links may not work on Github.com.

# `FieldProps`

These are props that you pass to [`<Field/>`](../api/Field). You must provide one of the ways to render: `component`, `render`, or `children`.

## `afterSubmit`

```ts
() => void
```

Optional.

A callback to notify fields after submission has completed successfully.

## `allowNull`

```ts
boolean
```

Optional. Defaults to `false`.

By default, if your value is `null`, [`<Field/>`](../api/Field) will convert it to `''`, to ensure
[controlled inputs](https://reactjs.org/docs/forms.html#controlled-components).

But if you pass `true` to `allowNull`, [`<Field/>`](..api/Field) will give you a `null` value.

## `beforeSubmit`

```ts
() => void | false
```

Optional.

A function to call just before calling `onSubmit`. If `beforeSubmit` returns `false`, the submission will be aborted. If one of your fields returns `false` on `beforeSubmit`, other fields may not have their `beforeSubmit` called, as the submission is aborted on the first one that returns `false`.

## `children`

```ts
((props: FieldRenderProps) => React.Node) | React.Node`
```

Optional. (if you specify [`component`](#component) or [`render`](#render))

A render function that is given [`FieldRenderProps`](FieldRenderProps), as well as any non-API props passed into the `<Field/>` component. For example, if you did...

```tsx
<Field name="myField" someArbitraryOtherProp={42}>
  {props => {
    console.log(props.someArbitraryOtherProp) // would print 42
    return <input {...props.input}/>
  }}
</Form>
```

Note that if you specify [`render`](#render) or [`component`](#component) _and_ `children`, `render` will be called, with `children` injected as if it were an additional prop. This can be especially useful for doing something like:

```tsx
<Field name="favoriteColor" component="select">
  <option value="FF0000">Red</option>
  <option value="00FF00">Green</option>
  <option value="0000FF">Blue</option>
</Field>
```

Related:

- [`FieldRenderProps`](FieldRenderProps)

## `component`

```ts
React.ComponentType<FieldRenderProps> | 'input' | 'select' | 'textarea'`
```

Optional. If you are not using `'input'`, `'select`' or `'textarea'`, it is recommended that you use [`children`](#children) or [`render`](#render).

Either the `string` name of one of the default HTML inputs, or a component that is given [`FieldRenderProps`](FieldRenderProps) as props, children and render props, as well as any non-API props passed into the `<Field/>` component. For example, if you did...

<!-- prettier-ignore -->
```tsx
<Field
  name="myField"
  someArbitraryOtherProp={42}
  component={MyFieldComp} />

const MyFieldComp = props => {
  console.log(props.someArbitraryOtherProp) // would print 42
  return <input {...props.input} />
}
```

Related:

- [`FieldRenderProps`](FieldRenderProps)

## `defaultValue`

```ts
any
```

Optional.
⚠️ You probably want [`initialValue`](#initialvalue)! ⚠️

The value of the field upon creation. _**This value is only needed if you want your field be `dirty` upon creation (i.e. for its value to be different from its initial value).**_

## `format`

<!-- prettier-ignore -->
```ts
(value: any, name: string) => any
```

Optional.

A function that takes the value from the form values and the name of the field and formats the value to give to the input. Common use cases include converting javascript `Date` values into a localized date string. Almost always used in conjunction with [`parse`](#parse).

**Note: If you would like to disable the default behavior of converting `undefined` to `''`, you can pass an [identity function](https://en.wikipedia.org/wiki/Identity_function), `v => v`, to `format`. If you do this, making sure your inputs are "controlled" is up to you.**

## `formatOnBlur`

```ts
boolean
```

Optional. Defaults to `false`.

If `true`, the `format` function will only be called when the field is blurred. If `false`, `format` will be called on every render.

## `initialValue`

```ts
any
```

Optional.

The initial value for the field. This value will be used to calculate `dirty` and `pristine` by comparing it to the current value of the field. If you want field to be `dirty` upon creation, you can set one value with `initialValue` and set the value of the field with `defaultValue`.

The value given here will override any `initialValues` given to the entire form.

## `isEqual`

<!-- prettier-ignore -->
```ts
(a: any, b: any) => boolean
```

Optional. Defaults to `===`.

A function to determine if two values are equal.

## `name`

```ts
string
```

**Required**

The name of your field. Field values may be deeply nested using dot-and-bracket syntax.

[Learn more about Field Names](/docs/final-form/field-names).

## `parse`

<!-- prettier-ignore -->
```ts
(value: any, name: string) => any
```

Optional.

A function that takes the value from the input and name of the field and converts the value into the value you want stored as this field's value in the form. Common usecases include converting strings into `Number`s or parsing localized dates into actual javascript `Date` objects. Almost always used in conjuction with [`format`](#format).

**Note: If would like to override the default behavior of converting `''` to `undefined`, you can pass an [identity function](https://en.wikipedia.org/wiki/Identity_function), `v => v`, to `parse`, thus allowing you to have form values of `''`.**

## `render`

<!-- prettier-ignore -->
```ts
(props: FieldRenderProps) => React.Node
```

Optional. (if you specify [`component`](#component) or [`children`](#children))

A render function that is given [`FieldRenderProps`](FieldRenderProps), as well as any non-API props passed into the `<Field/>` component. For example, if you did...

```tsx
<Field
  name="myField"
  someArbitraryOtherProp={42}
  render={props => {
    console.log(props.someArbitraryOtherProp) // would print 42
    return <input {...props.input} />
  }}
/>
```

Note that if you specify `render` _and_ [`children`](#children), `render` will be called, with `children` injected as if it were an additional prop.

Related:

- [`FieldRenderProps`](FormRenderProps)

## `subscription`

```ts
{ [string]: boolean }
```

Optional. _Advanced Usage_

An object of the parts of [`FieldState`](/docs/final-form/types/FieldState) to subscribe to. If a subscription is provided, the [`<Field/>`](../api/Field) will only rerender when those parts of field state change.

If no `subscription` is provided, it will default to subscribing to _all_ field state changes. i.e. [`<Field/>`](../api/Field) will rerender whenever any part of the field state changes.

Related:

- [`FieldState`](/docs/final-form/types/FieldState)

## `validate`

```ts
(value: ?any, allValues: Object, meta: ?FieldState) => ?any
```

Optional.

A function that takes the field value, all the values of the form and the `meta` data about the field and returns an error if the value is invalid, or `undefined` if the value is valid.

⚠️ IMPORTANT ⚠️ – By default, in order to allow inline fat-arrow validation functions, the field will not rerender if you change your validation function to an alternate function that has a different behavior. If you need your field to rerender with a new validation function, you will need to update another prop on the `Field`, such as `key`. See the following sandbox for an example:

[![Edit Changing Field Level Validators](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/changing-field-level-validators-zc8ei?fontsize=14)

## `validateFields`

```ts
string[]
```

Optional.

An array of field names to validate when this field changes. If `undefined`,
_every_ field will be validated when this one changes; if `[]`, _only this
field_ will have its field-level validation function called when it changes; if
other field names are specified, those fields _and this one_ will be validated
when this field changes.

⚠️ IMPORTANT ⚠️ – By default, in order to allow inline `[]` syntax, the field will not rerender if you change your `validateFields` prop changes. If you need your field to rerender with a new `validateFields` setting, you will need to update another prop on the `Field`, such as `key`.

## `value`

```ts
any
```

Optional.

**This is only used for checkboxes and radio buttons!**

You must also include a `type="radio"` or `type="checkbox"` prop.

### Radio Buttons

The value of the radio button. The radio button will render as `checked` if and only if the value given here `===` the value for the field in the form.

### Checkboxes

#### With `value`

The checkbox will be `checked` if the value given in `value` is contained in the array that is the value for the field for the form. Checking the box will add the value to the array, and unchecking the checkbox will remove the value from the array.

#### Without `value`

The checkbox will be `checked` if the value is truthy. Checking the box will set the value to `true`, and unchecking the checkbox will set the value to `false`.
