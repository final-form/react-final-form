import React from 'react'
import { render } from 'react-dom'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import Icon from 'react-fontawesome'
import setFieldData from 'final-form-set-field-data'
import OnBlurValidation from './OnBlurValidation'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}
const isBeatle = value =>
  ~['john', 'paul', 'george', 'ringo'].indexOf(value.toLowerCase())

const Error = ({ name }) => (
  <Field
    name={name}
    subscription={{ data: true }}
    render={({ meta: { data } }) =>
      data.error ? <span>{data.error}</span> : null
    }
  />
)
const AsyncIndicator = ({ name }) => (
  <Field
    name={name}
    subscription={{ data: true }}
    render={({ meta: { data } }) =>
      data.validating ? <Icon name="cog" spin /> : null
    }
  />
)

const App = () => (
  <Styles>
    <h1>🏁 React Final Form</h1>
    <h2>Custom Validation Engine</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      This example includes a special <code>OnBlurValidation</code> component
      that manages its own set of validation rules, completely apart from 🏁
      Final Form's validation engine. This allows the rules to be run only on
      blur, and maintains "validating" state for asynchronous validations. The
      function then injects the <code>hasErrors</code> state into a render
      function to render the rest of the form, thus allowing submission to be
      halted if errors are present.
    </p>
    <p>
      Any first name value of <code>John</code>, <code>Paul</code>,{' '}
      <code>George</code>, or <code>Ringo</code> will fail asynchronous
      validation.
    </p>
    <Form
      onSubmit={onSubmit}
      mutators={{ setFieldData }}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <OnBlurValidation
          rules={{
            firstName: (value, setError) => {
              if (!value) {
                // return synchronously
                setError('Required')
              } else {
                // return asynchronously
                setTimeout(() => {
                  if (isBeatle(value)) {
                    setError('No Beatles')
                  } else {
                    setError(undefined)
                  }
                }, 1000)
              }
            },
            lastName: (value, setError) =>
              setError(value ? undefined : 'Required')
          }}
          render={({ hasErrors, validating }) => (
            <form
              onSubmit={event => {
                event.preventDefault()
                if (!hasErrors && !validating) handleSubmit()
              }}
            >
              <div>
                <label>First Name</label>
                <Field
                  name="firstName"
                  component="input"
                  type="text"
                  placeholder="First Name"
                />
                <AsyncIndicator name="firstName" />
                <Error name="firstName" />
              </div>
              <div>
                <label>Last Name</label>
                <Field
                  name="lastName"
                  component="input"
                  type="text"
                  placeholder="Last Name"
                />
                <AsyncIndicator name="lastName" />
                <Error name="lastName" />
              </div>
              <div>
                <label>Email</label>
                <Field
                  name="email"
                  component="input"
                  type="email"
                  placeholder="Email"
                />
                <AsyncIndicator name="email" />
                <Error name="email" />
              </div>
              <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={reset}
                  disabled={submitting || pristine}
                >
                  Reset
                </button>
              </div>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          )}
        />
      )}
    />
  </Styles>
)

render(<App />, document.getElementById('root'));
