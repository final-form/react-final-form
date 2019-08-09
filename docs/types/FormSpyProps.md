# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/types/FormSpyProps). Links may not work on Github.com.

# `FormSpyProps`

These are the props that you pass to [`<FormSpy/>`](../api/FormSpy). If you do not provide an [`onChange`](#onchange) callback, you must provide one of the ways to render: [`component`](#component), [`render`](#render), or [`children`](#children).

## `children`

<!-- prettier-ignore -->
```ts
(props: FormRenderProps) => React.Node
```

Optional. (if you specify [`component`](#component) or [`render`](#render) or [`onChange`](#onchange))

A render function that is given [`FormSpyRenderProps`](FormSpyRenderProps), as well as any non-API props passed into the `<FormSpy/>` component. For example, if you did...

```tsx
<FormSpy someArbitraryOtherProp={42}>
  {props => {
    console.log(props.someArbitraryOtherProp) // would print 42
    return <pre>{JSON.stringify(props.values, undefined, 2)}</pre>
  }}
</FormSpy>
```

Note that if you specify [`render`](#render) _and_ `children`, `render` will be called, with `children` injected as if it were an additional prop.

**Will not be called if an [`onChange`](#onchange) callback is specified.**

Related:

- [`FormSpyRenderProps`](FormSpyRenderProps)

## `component`

```ts
React.ComponentType<FormSpyRenderProps>
```

Optional. It is recommended that you use [`children`](#children) or [`render`](#render).

A component that is given [`FormSpyRenderProps`](FormSpyRenderProps) as props, as well as any non-API props passed into the [`<FormSpy/>`](../api/FormSpy) component. For example, if you did...

<!-- prettier-ignore -->
```tsx
<FormSpy
  component={MyFormSpyComp}
  someArbitraryOtherProp={42} />

const MyFormSpyComp = props => {
  console.log(props.someArbitraryOtherProp) // would print 42
  return <pre>{JSON.stringify(props.values, undefined, 2)}</pre>
}
```

Note that your component will be rendered using [`React.createElement()`](https://reactjs.org/docs/react-api.html#createelement) resulting in your component actually being in the React node tree, i.e. inspectable in [DevTools](https://github.com/facebook/react-devtools#react-developer-tools-).

**Will not be called if an [`onChange`](#onchange) callback is specified.**

Related:

- [`FormSpyRenderProps`](FormSpyRenderProps)

## `onChange`

```ts
(formState: FormState) => void
```

Optional.

A change listener that will be called with form state whenever the form state, as subscribed to by the [`subscription`](#subscription) prop, has changed.

When an `onChange` prop is provided, the [`<FormSpy/>`](../api/FormSpy) will not render anything.

## `render`

<!-- prettier-ignore -->
```ts
(props: FormSpyRenderProps) => React.Node
```

Optional. (if you specify [`component`](#component) or [`children`](#children) or [`onChange`](#onchange))

A render function that is given [`FormSpyRenderProps`](FormSpyRenderProps), as well as any non-API props passed into the `<FormSpy/>` component. For example, if you did...

```tsx
<FormSpy
  someArbitraryOtherProp={42}
  render={props => {
    console.log(props.someArbitraryOtherProp) // would print 42
    return <pre>{JSON.stringify(props.values, undefined, 2)}</pre>
  }}
/>
```

Note that if you specify `render` _and_ [`children`](#children), `render` will be called, with `children` injected as if it were an additional prop.

**Will not be called if an [`onChange`](#onchange) callback is specified.**

Related:

- [`FormSpyRenderProps`](FormSpyRenderProps)

## `subscription`

```ts
{ [string]: boolean }
```

Optional. _Advanced Usage_

An object of the parts of [`FormState`](/docs/final-form/types/FormState) to subscribe to. If a subscription is provided, the [`<FormSpy/>`](../api/FormSpy) will only rerender when those parts of form state change.

If no `subscription` is provided, it will default to subscribing to _all_ form state changes. i.e. [`<FormSpy/>`](../api/FormSpy) will rerender whenever any part of the form state changes.

Related:

- [`FormState`](/docs/final-form/types/FormState)
