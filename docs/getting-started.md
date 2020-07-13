# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/getting-started). Links may not work on Github.com.

# Getting Started

Before we jump right into code, you might want to learn a little bit about the [philosophy](philosophy) and origin story of React Final Form.

## Installation

```bash
npm install --save final-form react-final-form
```

or

```bash
yarn add final-form react-final-form
```

## Architecture

React Final Form is a thin React wrapper for [Final Form](/), which is a subscriptions-based form state management library that uses the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern), so only the components that need updating are re-rendered as the form's state changes.

By default, **React Final Form subscribes to _all_ changes**, but if you want to fine tune your form to optimized blazing-fast perfection, you may specify only the form state that you care about for rendering your gorgeous UI. You can think of it a little like GraphQL's feature of only fetching the data your component needs to render, and nothing else.

## Code

Here's what it looks like in your code:

```jsx
import { Form, Field } from 'react-final-form'

const MyForm = () => (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Field name="firstName" component="input" placeholder="First Name" />
        </div>

        <h2>An Arbitrary Reusable Input Component</h2>
        <div>
          <label>Interests</label>
          <Field name="interests" component={InterestPicker} />
        </div>

        <h2>Render Function</h2>
        <Field
          name="bio"
          render={({ input, meta }) => (
            <div>
              <label>Bio</label>
              <textarea {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />

        <h2>Render Function as Children</h2>
        <Field name="phone">
          {({ input, meta }) => (
            <div>
              <label>Phone</label>
              <input type="text" {...input} placeholder="Phone" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>

        <button type="submit">Submit</button>
      </form>
    )}
  />
)
```

[Let's explore the API...](api)
