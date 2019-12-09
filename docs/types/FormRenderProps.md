# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/types/FormRenderProps). Links may not work on Github.com.

# `FormRenderProps`

These are the props that [`<Form/>`](../api/Form) provides to your render function or component. Keep in mind that the values you receive here are dependent upon which values of [`FormState`](/docs/final-form/types/FormState) you have subscribed to with the [`subscription` prop](FormProps#subscription).

This object contains everything in Final Form's [`FormState`](/docs/final-form/types/FormState) as well as:

## `form`

```ts
FormApi
```

The Final Form [`FormApi`](/docs/final-form/types/FormApi).

## `handleSubmit`

```ts
(?SyntheticEvent<HTMLFormElement>) => ?Promise<?Object>
```

A function intended for you to give directly to the `<form>` tag:

<!-- prettier-ignore -->
```jsx
<form onSubmit={handleSubmit}>
... fields go here ...
</form>
```

The function's return type depends on the way the [`onSubmit` function is written](../types/FormProps#onsubmit).

Related:

- [`SyntheticEvent`](https://reactjs.org/docs/events.html)
