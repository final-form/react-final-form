import React from 'react'
import { render } from 'react-dom'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const App = () => (
  <Styles>
    <h1>React Final Form - Simple Example</h1>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <Form
      onSubmit={onSubmit}
      initialValues={{ stooge: 'larry', employed: false }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
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
            <label>Employed</label>
            <Field name="employed" component="input" type="checkbox" />
          </div>
          <div>
            <label>Favorite Color</label>
            <Field name="favoriteColor" component="select">
              <option />
              <option value="#ff0000">
                <span role="img" aria-label="Red Heart">
                  ❤️
                </span>{' '}
                Red
              </option>
              <option value="#00ff00">
                <span role="img" aria-label="Green Heart">
                  💚
                </span>{' '}
                Green
              </option>
              <option value="#0000ff">
                <span role="img" aria-label="Blue Heart">
                  💙
                </span>{' '}
                Blue
              </option>
            </Field>
          </div>
          <div>
            <label>Toppings</label>
            <Field name="toppings" component="select" multiple>
              <option value="chicken">
                <span role="img" aria-label="Chicken">
                  🐓
                </span>{' '}
                Chicken
              </option>
              <option value="ham">
                <span role="img" aria-label="Pig">
                  🐷
                </span>{' '}
                Ham
              </option>
              <option value="mushrooms">
                <span role="img" aria-label="Mushroom">
                  🍄
                </span>{' '}
                Mushrooms
              </option>
              <option value="cheese">
                <span role="img" aria-label="Cheese">
                  🧀
                </span>{' '}
                Cheese
              </option>
              <option value="tuna">
                <span role="img" aria-label="Fish">
                  🐟
                </span>{' '}
                Tuna
              </option>
              <option value="pineapple">
                <span role="img" aria-label="Pineapple">
                  🍍
                </span>{' '}
                Pineapple
              </option>
            </Field>
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
                  value="mayonnaise"
                />{' '}
                Mayonnaise
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
            <label>Best Stooge</label>
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
            <label>Notes</label>
            <Field name="notes" component="textarea" placeholder="Notes" />
          </div>
          <div className="buttons">
            <button type="submit" disabled={submitting || pristine}>
              Submit
            </button>
            <button
              type="button"
              onClick={form.reset}
              disabled={submitting || pristine}
            >
              Reset
            </button>
          </div>
          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    />
  </Styles>
)

render(<App />, document.getElementById('root'))
