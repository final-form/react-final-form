# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/migration-guide/formik). Links may not work on Github.com.

# Migration from Formik

Good news! Because both React Final Form and Formik are second generation form libraries, they both copied much of their API from [Redux Form](https://redux-form.com), so, despite working very differently under the hood, there is a lot of overlap in their APIs.

## Props passed to `<Formik/>`

The following props passed to `<Formik/>` are more or less identical to those you can pass to [`<Form/>`](../api/Form):

- [`onSubmit`](../types/FormProps#onsubmit)
- [`initialValues`](../types/FormProps#initialvalues)
- [`validate`](../types/FormProps#validate)

The render props work the same way, except for [what is passed](#props-passed-by-formik).

- [`children`](../types/FormProps#children)
- [`component`](../types/FormProps#component)
- [`render`](../types/FormProps#render)

The only tricky one is:

- [`validateOnBlur`](../types/FormProps#validateonblur)

It's not the same at all. In Formik, `validateOnBlur` defaults to `true` and it allows you to tell Formik _not_ to validate on blur. React Final Form validates on every change by default, and setting `validateOnBlur` to `true` is a way to tell React Final Form to _only_ validate on blur (to _not_ validate on change).

## Props passed by `<Formik/>`

The following props passed into the render functions by `<Formik/>` are identical:

- [`dirty`](/docs/final-form/types/FormState#dirty)
- [`errors`](/docs/final-form/types/FormState#errors)
- [`touched`](/docs/final-form/types/FormState#touched)
- [`handleSubmit`](/docs/final-form/types/FormRenderProps#handlesubmit)

To migrate from Formik, you'd have to search and replace the following:

| Formik              | React Final Form                                            |
| ------------------- | ----------------------------------------------------------- |
| `isSubmitting`      | [`submitting`](/docs/final-form/types/FormState#submitting) |
| `isValid`           | [`valid`](/docs/final-form/types/FormState#valid)           |
| `isValidating`      | [`validating`](/docs/final-form/types/FormState#validating) |
| `resetForm()`       | [`form.reset()`](/docs/final-form/types/FormApi#reset)      |
| `submitForm()`      | [`form.submit()`](/docs/final-form/types/FormApi#submit)    |
| `setFieldTouched()` | [`form.blur()`](/docs/final-form/types/FormApi#blur)        |
| `setFieldValue()`   | [`form.change()`](/docs/final-form/types/FormApi#change)    |

## Props passed to `<Field/>`

The APIs of the [`<Field/>`](../api/Field) components are very similiar. They both have:

- [`name`](../types/FieldProps#name)
- [`children`](../types/FieldProps#children)
- [`component`](../types/FieldProps#component)
- [`render`](../types/FieldProps#render)
- [`validate`](../types/FieldProps#validate)

One difference is that Formik's `<Field/>` will default to `component="input"` if no rendering strategy is provided. React Final Form requires you to specify one of the render strategies.

## Props passed by `<Field/>`

The biggest difference is that Formik puts all the `name`, `onChange`, `onBlur`, and `value` into a prop called `field`, React Final Form puts them into a prop called `input`. So:

Formik:

```jsx
<Field
  name="lastName"
  render={({ field }) => <input {...field} placeholder="Last Name" />}
/>
```

React Final Form:

```jsx
<Field
  name="lastName"
  render={({ input }) => <input {...input} placeholder="Last Name" />}
  //         ^^^^^                  ^^^^^
/>
```

The other difference is that, while Formik just gives your field component the Formik instance to query for information about field state, React Final Form provides your field state for you in the `meta` prop. Things like [`active`](../types/FieldRenderProps#metaactive) (which Formik doesn't even track), [`dirty`](../types/FieldRenderProps#metadirty), [`pristine`](../types/FieldRenderProps#metapristine), [`valid`](../types/FieldRenderProps#metavalid), [`invalid`](../types/FieldRenderProps#metainvalid), [`touched`](../types/FieldRenderProps#metatouched), [`validating`](../types/FieldRenderProps#metavalidating), and [`visited`](../types/FieldRenderProps#metavisited) (also not in Formik).

## Formik's `<Form/>`

React Final Form doesn't provide a similar component, because it just doesn't seem that useful, and it's also trivial to write one yourself.

```jsx
import { useForm } from 'react-final-form'

const FormLikeFormik = props => {
  const form = useForm()
  return (
    <form
      {...props}
      onSubmit={event => {
        event.preventDefault()
        form.submit()
      }}
    />
  )
}
```

## Formik's `<ErrorMessage/>`

This component _does_ seem useful, and writing your own is a great introduction to React Final Form's subscription system.

### With `<Field/>`

```jsx
import { Field } from 'react-final-form'

const ErrorMessage = ({ name }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { error, touched } }) =>
      error && touched ? <span>{error}</span> : null
    }
  </Field>
)
```

...or, if you want to look cool...

### With Hooks

```jsx
import { useField } from 'react-final-form'

const ErrorMessage = ({ name }) => {
  const {
    meta: { error, touched }
  } = useField(name, { subscription: { error: true, touched: true } })
  return error && touched ? <span>{error}</span> : null
}
```

## Formik's `<FastField/>`

React Final Form's [`<Field/>`](../api/Field) has always, from day one, avoided rerenders when parts of the form state change that don't affect the field in question. On top of that, React Final Form's `<Field/>` provides a [`subscription`](../types/FieldProps#subscription) prop that allows you to have even more fine-grain control over _precisely_ which form state will cause your field to rerender.

## Formik's `connect()`

React Final Form has no higher order components, because [it's just not necessary](../faq#why-no-hoc). If you need access to the Final Form instance, you can use the [`useForm()`](../api/useForm) hook.

## A Diff

This is what would need to change to migrate the form on Formik's [Overview](https://jaredpalmer.com/formik/docs/overview#reducing-boilerplate) docs page to React Final Form.

```diff
 import React from 'react'
-import { Formik, Form, Field, ErrorMessage } from 'formik'
+import { Form, Field, useField } from 'react-final-form'

+// Obviously this could be reused across your project
+const ErrorMessage = ({ name, component }) => {
+  const {
+    meta: { error, touched }
+  } = useField(name, { subscription: { error: true, touched: true } })
+  return error && touched
+    ? React.createElement(component, null, error)
+    : null
+}

 const Basic = () => (
   <div>
     <h1>Any place in your app!</h1>
-    <Formik
+    <Form
       initialValues={{ email: '', password: '' }}
       validate={values => {
         let errors = {}
         if (!values.email) {
           errors.email = 'Required'
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address'
         }
         return errors
       }}
-      onSubmit={(values, { setSubmitting }) => {
+      onSubmit={(values) => {
+        // final-form manages submitting status
+        // for you *if* you return a promise
+        return new Promise(resolve =>
         setTimeout(() => {
           alert(JSON.stringify(values, null, 2))
-          setSubmitting(false)
+          resolve()
         }, 400)
+        )
       }}
     >
-      {({ isSubmitting }) => (
-        <Form>
+      {({ handleSubmit, submitting }) => (
+        <form onSubmit={handleSubmit}>
-          <Field type="email" name="email" />
+          <Field type="email" name="email" component="input"/>
           <ErrorMessage name="email" component="div" />
-          <Field type="password" name="password" />
+          <Field type="password" name="password" component="input"/>
           <ErrorMessage name="password" component="div" />
-          <button type="submit" disabled={isSubmitting}>
+          <button type="submit" disabled={submitting}>
             Submit
           </button>
-        </Form>
+        </form>
       )}
-    </Formik>
+    </Form>
   </div>
 )

 export default Basic
```
