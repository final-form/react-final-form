import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import DownshiftInput from "./DownshiftInput";
import fruit from "./fruit";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};
const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "Required";
  }
  if (!values.fruit) {
    errors.fruit = "Required";
  }
  return errors;
};
const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>
      <span role="img" aria-label="racecar">
        🏎️
      </span>{" "}
      Downshift Example
    </h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      This example demonstrates using a{" "}
      <a href="https://github.com/paypal/downshift">
        <span role="img" aria-label="racecar">
          🏎️
        </span>{" "}
        Downshift
      </a>{" "}
      type-ahead component.
    </p>
    <Form
      onSubmit={onSubmit}
      validate={validate}
      render={({ handleSubmit, form, pristine, submitting, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name</label>
            <Field
              name="firstName"
              component="input"
              type="text"
              placeholder="First Name"
            />
            <Error name="firstName" />
          </div>
          <div>
            <label>Favorite Fruit</label>
            <Field
              name="fruit"
              items={fruit}
              component={DownshiftInput}
              placeholder="Favorite Fruit"
            />
            <Error name="fruit" />
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
  </Styles>
);

render(<App />, document.getElementById("root"));
