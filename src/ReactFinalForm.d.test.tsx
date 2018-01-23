import * as React from 'react'
import { Form, Field } from './index'
import { Mutator } from 'final-form/dist'

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

const setValue: Mutator = ([name, newValue], state, { changeValue }) => {
  changeValue(state, name, value => newValue)
}

const mutated = () => (
  <Form onSubmit={onSubmit} mutators={{ setValue }}>
    {({
      handleSubmit,
      mutators: { setValue },
      submitting,
      pristine,
      values
    }) => (
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          component="input"
          type="text"
          placeholder="First Name"
        />
        <button
          type="button"
          onClick={e => setValue('firstName', 'Kevin')}
          disabled={submitting || pristine}
        >
          Reset
        </button>
        <pre>{JSON.stringify(values)}</pre>
      </form>
    )}
  </Form>
)
