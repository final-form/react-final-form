import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import store, { promiseListener } from "./store";
import {
  REGISTER,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
} from "./registrationDuck";
import MakeAsyncFunction from "react-redux-promise-listener";

const SubmitError = ({ name }) => (
  <Field
    name={name}
    subscription={{ submitError: true, dirtySinceLastSubmit: true }}
  >
    {({ meta: { submitError, dirtySinceLastSubmit } }) =>
      submitError && !dirtySinceLastSubmit ? <span>{submitError}</span> : null
    }
  </Field>
);

const App = () => (
  <Provider store={store}>
    <Styles>
      <h1>
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form
      </h1>
      <h2>Async Redux Submission</h2>
      <a href="https://github.com/erikras/react-final-form#-react-final-form">
        Read Docs
      </a>
      <p>
        Demonstrates how to use an async Redux side-effects library, like{" "}
        <code>redux-saga</code> to manage form submissions using{" "}
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form. Uses{" "}
        <a
          href="https://github.com/erikras/redux-promise-listener"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>redux-promise-listener</code>
        </a>{" "}
        and{" "}
        <a
          href="https://github.com/erikras/react-redux-promise-listener"
          target="_blank"
          rel="noopener noreferrer"
        >
          <code>react-redux-promise-listener</code>
        </a>{" "}
        libraries.
      </p>
      <p>Dispatched Redux actions can be found in the console.</p>
      <p>
        First name <code>John</code> will fail submit validation.
      </p>
      <MakeAsyncFunction
        listener={promiseListener}
        start={REGISTER}
        resolve={REGISTER_SUCCESS}
        reject={REGISTER_FAILURE}
      >
        {(onSubmit) => (
          <Form
            onSubmit={onSubmit}
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
                  <SubmitError name="firstName" />
                </div>
                <div>
                  <label>Last Name</label>
                  <Field
                    name="lastName"
                    component="input"
                    type="text"
                    placeholder="Last Name"
                  />
                  <SubmitError name="lastName" />
                </div>
                <div>
                  <label>Email</label>
                  <Field
                    name="email"
                    component="input"
                    type="email"
                    placeholder="Email"
                  />
                  <SubmitError name="email" />
                </div>
                <div>
                  <label>Favorite Color</label>
                  <Field name="favoriteColor" component="select">
                    <option />
                    <option value="#ff0000">
                      <span role="img" aria-label="red heart">
                        ❤️
                      </span>{" "}
                      Red
                    </option>
                    <option value="#00ff00">
                      <span role="img" aria-label="green heart">
                        💚
                      </span>{" "}
                      Green
                    </option>
                    <option value="#0000ff">
                      <span role="img" aria-label="blue heart">
                        💙
                      </span>{" "}
                      Blue
                    </option>
                  </Field>
                </div>
                <div className="buttons">
                  <button type="submit" disabled={submitting}>
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
        )}
      </MakeAsyncFunction>
    </Styles>
  </Provider>
);

render(<App />, document.getElementById("root"));
