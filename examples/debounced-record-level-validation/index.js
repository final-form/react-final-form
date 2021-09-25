import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import ErrorWithDelay from "./ErrorWithDelay";
import { Form, Field } from "react-final-form";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form Example
    </h1>
    <h2>Synchronous Record-Level Validation (with debounced errors)</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      The important feature of this demo is that the errors <em>disappear</em>{" "}
      instantly when they are fixed, appear instantly when blurred, but{" "}
      <em>appear</em> on a delay when the field is active. Notice that the delay
      mechanism is entirely separate from Final Form, encapsulated into a{" "}
      <code>ErrorWithDelay</code> component.
    </p>
    <p>
      Things to try:
      <ul>
        <li>Tab through all fields and watch errors appear on blur.</li>
        <li>
          Remove first name value and notice how it doesn't complain for a
          second.
        </li>
        <li>
          Notice how you can type "44" as your age without the error for "4"
          being an illegal value being displayed.
        </li>
      </ul>
    </p>
    <Form
      onSubmit={onSubmit}
      initialValues={{ firstName: "Bob" }}
      validate={(values) => {
        const errors = {};
        if (!values.firstName) {
          errors.firstName = "Required";
        }
        if (!values.lastName) {
          errors.lastName = "Required";
        }
        if (!values.age) {
          errors.age = "Required";
        } else if (isNaN(values.age)) {
          errors.age = "Must be a number";
        } else if (values.age < 18) {
          errors.age = "Must be >18";
        }
        return errors;
      }}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Field name="firstName">
            {({ input, meta }) => (
              <div>
                <label>First Name</label>
                <input {...input} type="text" placeholder="First Name" />
                <ErrorWithDelay name="firstName" delay={1000}>
                  {(error) => <span>{error}</span>}
                </ErrorWithDelay>
              </div>
            )}
          </Field>
          <Field name="lastName">
            {({ input, meta }) => (
              <div>
                <label>Last Name</label>
                <input {...input} type="text" placeholder="Last Name" />
                <ErrorWithDelay name="lastName" delay={1000}>
                  {(error) => <span>{error}</span>}
                </ErrorWithDelay>
              </div>
            )}
          </Field>
          <Field name="age">
            {({ input, meta }) => (
              <div>
                <label>Age</label>
                <input {...input} type="text" placeholder="Age" />
                <ErrorWithDelay name="age" delay={1000}>
                  {(error) => <span>{error}</span>}
                </ErrorWithDelay>
              </div>
            )}
          </Field>
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
  </Styles>
);

render(<App />, document.getElementById("root"));
