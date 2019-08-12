# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/migration-guide/redux-form). Links may not work on Github.com.

# Migration from Redux Form

Good news! React Final Form was written by the same guy ([@erikras](https://twitter.com/erikras)) that wrote Redux Form, so much of the API is exactly the same. The primary difference is that, rather than "decorate" your form component with a Higher Order Component, you use React Final Form's [`<Form/>`](../api/Form) component to give you all your form state via a render prop. Most of the `config` properties from Redux Form maps directly onto the props to [`<Form/>`](../api/Form), e.g. [`initialValues`](../types/FormProps#initialvalues), [`onSubmit`](../types/FormProps#onsubmit), [`validate`](../types/FormProps#validate), etc.

### Step 1: Change your imports

```diff
 import React from 'react'
-import { reduxForm, Field } from 'redux-form',
+import { Form, Field } from 'react-final-form',
```

### Step 2: Surround your `<form/>` with a `<Form/>`

```diff
 import React from 'react'
 import { Form, Field } from 'react-final-form',

 const MyForm = props => {
   const { handleSubmit, pristine, reset, submitting } = props
   return (
+    <Form>
+      {() => (
         <form onSubmit={handleSubmit}>

           ...fields here...

         </form>
+      )}
+    </Form>
   )
 }
```

### Step 3: Move all your `config` values from `reduxForm()` to be props of `<Form/>`

```diff
 import React from 'react'
 import { Form, Field } from 'react-final-form'

 const MyForm = props => {
   const { handleSubmit, pristine, reset, submitting } = props
   return (
     <Form
+      initialValues={{
+        firstName: 'Dan'
+      }}
+      onSubmit={values => {
+        // send values to the cloud
+      }}
+      validate={values => {
+        // do validation here, and return errors object
+      }}
     >
      {() => (
        <form onSubmit={handleSubmit}>

          ...fields here...

        </form>
       )}
     </Form>
   )
 }

 export default reduxForm({
   form: 'myForm',
-   initialValues: {
-     firstName: 'Dan'
-   },
-   onSubmit: values => {
-     // send values to the cloud
-   },
-   validate: values => {
-     // do validation here, and return errors object
-   }
 })(MyForm)
```

### Step 4: Get form state from `<Form/>`, not as props

```diff
 import React from 'react'
 import { Form, Field } from 'react-final-form'

 const MyForm = props => {
-  const { handleSubmit, pristine, reset, submitting } = props
   return (
     <Form
      initialValues={{
        firstName: 'Dan'
      }}
      onSubmit={values => {
        // send values to the cloud
      }}
      validate={values => {
        // do validation here, and return errors object
      }}
     >
+     {({ handleSubmit, pristine, reset, submitting }) => (
        <form onSubmit={handleSubmit}>

          ...fields here...

        </form>
       )}
     </Form>
   )
 }

 export default reduxForm({
   form: 'myForm'
 })(MyForm)
```

### Step 5: Observe API changes

_Some_ of the API is slightly different. For example, rather than providing a `reset` function, the entire [`FormApi`](/docs/final-form/types/FormApi) object is provided, on which `reset()` is a function.

```diff
 import React from 'react'
 import { Form, Field } from 'react-final-form'

 const MyForm = props => {
   return (
     <Form
      initialValues={{
        firstName: 'Dan'
      }}
      onSubmit={values => {
        // send values to the cloud
      }}
      validate={values => {
        // do validation here, and return errors object
      }}
     >
-     {({ handleSubmit, pristine, reset, submitting }) => (
+     {({ handleSubmit, pristine, form, submitting }) => (
        <form onSubmit={handleSubmit}>

          ...fields here...

          <div>
            <button type="submit" disabled={submitting}>
              Submit
            </button>
            <button
              type="button"
              disabled={pristine || submitting}
-             onClick={reset}
+             onClick={form.reset}
            >
              Clear Values
            </button>
          </div>
        </form>
       )}
     </Form>
   )
 }

 export default reduxForm({
   form: 'myForm'
 })(MyForm)
```

### Step 6: Remove the HOC

Now you can just export your component. No HOC decorator needed! [Why?](../faq#why-no-hoc)

```diff
-export default reduxForm({
-  form: 'myForm'
-})(MyForm)
+export default MyForm
```

### Step 7: Define your `renderField` functions inline (if you want)

With Redux Form, it was common to have to do something like this:

```jsx
// outside your render() method
const renderField = (field) => (
    <div className="input-row">
      <input {...field.input} type="text"/>
      {field.meta.touched && field.meta.error &&
       <span className="error">{field.meta.error}</span>}
    </div>
  )

// inside your render() method
<Field name="myField" component={renderField}/>
```

With React Final Form, you can define your render logic directly your JSX.

```jsx
// inside your render() method
<Field name="myField">
  {field => (
    <div className="input-row">
      <input {...field.input} type="text" />
      {field.meta.touched && field.meta.error && (
        <span className="error">{field.meta.error}</span>
      )}
    </div>
  )}
</Field>
```

It's a little easier to read, but it's less reusable. Large projects are going to create reusable field render functions. If you're migrating a mature project, you can probably continue to use your existing functions/components. [`<Field/>`](../api/Field) provides the same [`{ input, meta }` shape](../types/FieldRenderProps) that Redux Form does.

### The Full Diff

```diff
 import React from 'react'
-import { reduxForm, Field } from 'redux-form',
+import { Form, Field } from 'react-final-form'

 const MyForm = props => {
-  const { handleSubmit, pristine, reset, submitting } = props
   return (
+    <Form
+      initialValues={{
+        firstName: 'Dan'
+      }}
+      onSubmit={values => {
+        // send values to the cloud
+      }}
+      validate={values => {
+        // do validation here, and return errors object
+      }}
+    >
+      {({ handleSubmit, pristine, form, submitting }) => (
         <form onSubmit={handleSubmit}>
           <div>
             <Field
               name="firstName"
               component="input"
               type="text"
               placeholder="First Name"
             />
           </div>
           <div>
             <label>Last Name</label>
             <Field
               name="lastName"
               component="input"
               type="text"
               placeholder="Last Name"
             />
           </div>
           <div>
             <button type="submit" disabled={submitting}>
               Submit
             </button>
            <button
              type="button"
              disabled={pristine || submitting}
-             onClick={reset}
+             onClick={form.reset}
            >
              Clear Values
            </button>
           </div>
         </form>
+      )}
+    </Form>
   )
 }

-export default reduxForm({
-  form: 'myForm',
-  initialValues: {
-    firstName: 'Dan'
-  },
-  onSubmit: values => {
-    // send values to the cloud
-  },
-  validate: values => {
-    // do validation here, and return errors object
-  }
-})(MyForm)
+export default MyForm
```

### Cheat Code: The Lazy Way

⚠️ NOT RECOMMENDED ⚠️

There's some chance that you could get away with implementing this function that replicates what the `reduxForm()` decorator does:

```jsx
import { Form } from 'react-final-form'

const reactFinalForm = ({ form, ...config }) => component => props => (
  <Form {...config} {...props} component={component} />
)
```

Then you'd only have to change that one thing.

```diff
-export default reduxForm({
+export default reactFinalForm({
   form: 'myForm',
   initialValues: {
     firstName: 'Dan'
   },
   onSubmit: values => {
     // send values to the cloud
   },
   validate: values => {
     // do validation here, and return errors object
   }
 })(MyForm)
```

But cheats like this create technical debt, so do the right thing and refactor your forms to use render props. 😄
