# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/types/FormSpyRenderProps). Links may not work on Github.com.

# `FormSpyRenderProps`

These are the props that [`<FormSpy/>`](../api/FormSpy) provides to your render function or component. Keep in mind that the values you receive here are dependent upon which values of [`FormState`](/docs/final-form/types/FormState) you have subscribed to with the [`subscription`](FormSpyProps#subscription) prop.

This object contains everything in Final Form's [`FormState`](/docs/final-form/types/FormState) as well as:

## `form`

```ts
FormApi
```

The Final Form [`FormApi`](/docs/final-form/types/FormApi).
