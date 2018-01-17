import * as React from 'react'
import { Form, Field } from './index'

const onSubmit = async (values: any) => {
  console.log(values)
}
const basic = () => (
  <Form onSubmit={onSubmit}>
    {({ handleSubmit }) => (
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name</label>
          <Field
            name="firstName"
            component="input"
            type="text"
            placeholder="First Name"
          />
        </div>
      </form>
    )}
  </Form>
)

const simple = () => (
  <Form onSubmit={onSubmit}>
    {({ handleSubmit, reset, submitting, pristine, values }) => (
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          component="input"
          type="text"
          placeholder="First Name"
        />
        <button type="button" onClick={reset} disabled={submitting || pristine}>
          Reset
        </button>
        <button type="submit" disabled={submitting || pristine}>
          Submit
        </button>
        <pre>{JSON.stringify(values)}</pre>
      </form>
    )}
  </Form>
)

const simpleSubscription = () => (
  <Form
    onSubmit={onSubmit}
    subscription={{
      submitting: true,
      pristine: true,
      values: true
    }}
  >
    {({ handleSubmit, reset, submitting, pristine, values }) => (
      <form onSubmit={handleSubmit}>
        <button type="button" onClick={reset} disabled={submitting || pristine}>
          Reset
        </button>
        <pre>{JSON.stringify(values)}</pre>
      </form>
    )}
  </Form>
)
// const onSubmit: Config['onSubmit'] = (values, callback) => {}
//
// let form = createForm({ initialValues: {foo: 'bar'}, onSubmit })
// let formState = form.getState()
//
// console.log(formState.active as string, formState.active as undefined)
// console.log(formState.dirty as boolean)
// console.log(formState.dirtySinceLastSubmit as boolean)
// console.log(formState.error.foo, formState.error as string, formState.error as boolean)
// console.log(formState.errors as AnyObject, formState.errors.foo)
// console.log(formState.initialValues as AnyObject, formState.initialValues.foo)
// console.log(formState.invalid as boolean)
// console.log(formState.pristine as boolean)
// console.log(formState.submitError as string, formState.submitError as object, formState.submitError as undefined)
// console.log(formState.submitErrors as AnyObject, formState.submitErrors.foo)
// console.log(formState.submitFailed as boolean)
// console.log(formState.submitSucceeded as boolean)
// console.log(formState.submitSucceeded as boolean)
// console.log(formState.submitting as boolean)
// console.log(formState.valid as  boolean)
// console.log(formState.validating as boolean)
// console.log(formState.values as AnyObject, formState.values.foo)
//
// const initialValues: Config['initialValues'] = {
//   a: 'a',
//   b: true,
//   c: 1
// }
//
// form = createForm({ onSubmit, initialValues })
// formState = form.getState()
//
// console.log(formState.pristine as boolean)
// console.log(formState.dirty as boolean)
