import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import createDecorator from "final-form-focus";
import validate from "./validate";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};
const InputRow = ({ label, type, input, meta: { active, error, touched } }) => (
  <div className={active ? "active" : ""}>
    <label>{label}</label>
    <input {...input} type={type} placeholder={label} />
    {error && touched && <span>{error}</span>}
  </div>
);

const focusOnError = createDecorator();
const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form Example
    </h1>
    <h2>Focus On First Error</h2>
    <a href="https://github.com/final-form/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      Demonstrates how to use the{" "}
      <a
        href="https://github.com/final-form/final-form-focus"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        Final Form Focus{" "}
        <span role="img" aria-label="face with monocle">
          🧐
        </span>
      </a>{" "}
      library as a pluggable{" "}
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      Final Form decorator to provide "focus on first error" functionality.
      Notice what when you click the Submit button, the focus is placed on the
      first field with an error.
    </p>
    <Form
      onSubmit={onSubmit}
      decorators={[focusOnError]}
      validate={validate}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Field
            name="firstName"
            label="First Name"
            type="text"
            component={InputRow}
          />
          <Field
            name="lastName"
            label="Last Name"
            type="text"
            component={InputRow}
          />
          <Field
            name="street"
            label="Street"
            type="text"
            component={InputRow}
          />
          <Field name="age" label="Age" type="number" component={InputRow} />
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
