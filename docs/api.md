# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/api). Links may not work on Github.com.

# API

The API for React Final Form consists of three components and three hooks:

## Components

### [`<Form/>`](api/Form)

A component that surrounds your entire form and manages the form state. It can inject form state and functionality, e.g. a `handleSubmit` function for you to pass to your `<form>` element, via render props.

### [`<Field/>`](api/Field)

A component that lives inside your `<Form/>` and creates a "field". It register itself with the surrounding `<Form/>` tag and manages all the state for a particular field, providing input callbacks (e.g. `onBlur`, `onChange`, and `onFocus`) as well as the value of the form and myriad metadata about the state of the field.

### [`<FormSpy/>`](api/FormSpy)

_[Advanced Usage]_ A component that can tap into form-wide state from inside your `<Form/>`. It's primarily only for advanced usage when form renders are being restricted via the `subscription` prop.

## Hooks

### [`useField()`](api/useField)

A hook that will convert any of your components into a `<Field/>` component, registering with the surrounding `<Form/>` and providing field state to your component. `useField()` is used internally by `<Field/>`.

### [`useForm()`](api/useForm)

A hook that will pluck the Final Form [`form` instance](/docs/final-form/types/FormApi) out of context.

### [`useFormState()`](api/useFormState)

A hook that will convert any of your components into a `<FormSpy/>` component, allowing fine-grained control over subscribing to parts of the form state.
