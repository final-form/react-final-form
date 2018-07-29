import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import store from './store'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import FormStateToRedux from './FormStateToRedux'
import FormStateFromRedux from './FormStateFromRedux'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const App = () => (
  <Provider store={store}>
    <Styles>
      <h1>🏁 React Final Form</h1>
      <h2>Redux Example</h2>
      <a href="https://github.com/erikras/react-final-form#-react-final-form">
        Read Docs
      </a>
      <p>
        The only reason to keep your 🏁 Final Form form data in Redux is if you
        need to be able to read it from outside your form. This example
        demonstrates how to use a <code>FormSpy</code> to keep a copy of your
        form data in the Redux store. Note that the canonical authoritative
        version of the data still lives in 🏁 Final Form. If you need to{' '}
        <em>mutate</em> your data via dispatching Redux actions, you should
        probably use <a href="https://redux-form.com">Redux Form</a>.
      </p>
      <Form
        onSubmit={onSubmit}
        initialValues={{ employed: true, stooge: 'larry' }}
        subscription={{ submitting: true, pristine: true }}>
        {({ handleSubmit, reset, submitting, pristine }) => (
          <form onSubmit={handleSubmit}>
            <FormStateToRedux form="example" />
            <div>
              <label>First Name</label>
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
              <label>Email</label>
              <Field
                name="email"
                component="input"
                type="email"
                placeholder="Email"
              />
            </div>
            <div>
              <label>Favorite Color</label>
              <Field name="favoriteColor" component="select">
                <option />
                <option value="#ff0000">❤️ Red</option>
                <option value="#00ff00">💚 Green</option>
                <option value="#0000ff">💙 Blue</option>
              </Field>
            </div>
            <div>
              <label>Employed?</label>
              <Field name="employed" component="input" type="checkbox" />
            </div>
            <div>
              <label>Toppings</label>
              <Field name="toppings" component="select" multiple>
                <option value="ham">🐷 Ham</option>
                <option value="mushrooms">🍄 Mushrooms</option>
                <option value="cheese">🧀 Cheese</option>
                <option value="chicken">🐓 Chicken</option>
                <option value="pineapple">🍍 Pinapple</option>
              </Field>
            </div>
            <div>
              <label>Best Stooge?</label>
              <div>
                <label>
                  <Field
                    name="stooge"
                    component="input"
                    type="radio"
                    value="larry"
                  />{' '}
                  Larry
                </label>
                <label>
                  <Field
                    name="stooge"
                    component="input"
                    type="radio"
                    value="moe"
                  />{' '}
                  Moe
                </label>
                <label>
                  <Field
                    name="stooge"
                    component="input"
                    type="radio"
                    value="curly"
                  />{' '}
                  Curly
                </label>
              </div>
            </div>
            <div>
              <label>Sauces</label>
              <div>
                <label>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="ketchup"
                  />{' '}
                  Ketchup
                </label>
                <label>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="mustard"
                  />{' '}
                  Mustard
                </label>
                <label>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="salsa"
                  />{' '}
                  Salsa
                </label>
                <label>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="guacamole"
                  />{' '}
                  Guacamole 🥑
                </label>
              </div>
            </div>
            <div>
              <label>Notes</label>
              <Field name="notes" component="textarea" placeholder="Notes" />
            </div>
            <div className="buttons">
              <button type="submit" disabled={submitting || pristine}>
                Submit
              </button>
              <button
                type="button"
                onClick={reset}
                disabled={submitting || pristine}>
                Reset
              </button>
            </div>
            <h3>Form State from Redux</h3>
            <FormStateFromRedux form="example" />
          </form>
        )}
      </Form>
    </Styles>
  </Provider>
)

render(<App />, document.getElementById('root'))
