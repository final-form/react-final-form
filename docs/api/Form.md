# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/api/Form). Links may not work on Github.com.

# `<Form/>`

```ts
import { Form } from 'react-final-form'
```

A component that surrounds your entire form and manages the form state. It can inject form state and functionality, e.g. a `handleSubmit` function for you to pass to your `<form>` element, via render props.

On mount, `<Form/>` creates a Final Form [`form` instance](/docs/final-form/types/FormApi), subscribes to changes on that `form`, and places it into the [React Context](https://reactjs.org/docs/context.html) so that the [`<Field/>`](Field) and [`<FormSpy/>`](FormSpy) components can see it.

The `<Form/>` will rerender any time the form state it is subscribed to changes. By default it subscribes to _all_ form state. You can control which form state it subscribes to with the `subscription` prop.

## Props

`<Form/>` accepts [`FormProps`](../types/FormProps) and will call the render function with [`FormRenderProps`](../types/FormRenderProps).

The only two required props are [`onSubmit`](../types/FormProps#onsubmit) and one of [`component`](../types/FormProps#component), [`render`](../types/FormProps#render), or [`children`](../types/FormProps#children).

## Basic Usage

You need to do three things when using `<Form/>`:

### 1. Provide an `onSubmit` prop

`onSubmit` is a function that will be called with the values of your form when the user submits the form _and_ all validation passes. Your `onSubmit` function will not be called if there are validation errors.

### 2. Provide a way to render the form

There are three ways to render a `<Form/>` component:

| Prop                | Type                  |
| ------------------- | --------------------- |
| `<Form component/>` | `React.ComponentType` |
| `<Form render/>`    | `Function`            |
| `<Form children/>`  | `Function`            |

The only important distinction is that if you pass a `component` prop, it will be rendered with [`React.createElement()`](https://reactjs.org/docs/react-api.html#createelement), resulting in your component actually being in the React node tree, i.e. inspectable in [DevTools](https://github.com/facebook/react-devtools#react-developer-tools-).

While using `component` might feel easiest if you are migrating from [Redux Form's Higher Order Component](https://redux-form.com/8.2.2/docs/api/reduxform.md/) model, best practice recommends using a render prop.

### 3. Do something with `handleSubmit`

The most important thing that `<Form/>` will pass to your render function is the `handleSubmit` function. `handleSubmit` is a convenience method designed to be passed as the `onSubmit` prop to an HTML `<form>` component. `handleSubmit` will call `event.preventDefault()` to stop the default browser submission process.

In practice, your form will always look something like this:

<!-- prettier-ignore -->
```jsx
<Form onSubmit={onSubmit}>
  {props => (
    <form onSubmit={props.handleSubmit}>

      ... fields go here...

      <button type="submit">Submit</button>
    </form>
  )}
</Form>
```

Now, [let's look at adding some `<Field/>`](Field) components!
