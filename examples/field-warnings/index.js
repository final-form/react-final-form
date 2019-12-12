import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { WarningEngine } from "./warning-engine";
import { Form, Field } from "react-final-form";
import setFieldData from "final-form-set-field-data";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const onSubmit = async values => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const App = () => (
  <Styles>
    <h1><span role="img" aria-label="final form flag">
        🏁
      </span>{' '}React Final Form Example
    </h1>
    <h2>
      <span role="img" aria-label="final form flag">⚠️</span>
        {' '}Warnings{' '}
      <span role="img" aria-label="final form flag">⚠️</span>
    </h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      Warnings, in this example, are defined as: suggestions to the user, like
      validation errors, but that do not prevent submission. Note that the{" "}
      <code>&lt;WarningEngine/&gt;</code> component must be at the bottom of the
      form to guarantee that all the fields have registered.
    </p>
    <Form
      onSubmit={onSubmit}
      mutators={{ setFieldData }}
      render={({
        handleSubmit,
        reset,
        form: { mutators },
        submitting,
        pristine,
        values
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Field name="firstName">
              {({ input, meta }) => (
                <div>
                  <label>First Name</label>
                  <input {...input} placeholder="First Name" />
                  {meta.touched && meta.data.warning && (
                    <span>{meta.data.warning}</span>
                  )}
                </div>
              )}
            </Field>
            <Field name="lastName">
              {({ input, meta }) => (
                <div>
                  <label>Last Name</label>
                  <input {...input} placeholder="Last Name" />
                  {meta.touched && meta.data.warning && (
                    <span>{meta.data.warning}</span>
                  )}
                </div>
              )}
            </Field>
            <div className="buttons">
              <button type="submit" disabled={submitting}>
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
            <WarningEngine mutators={mutators} />
          </form>
        );
      }}
    />
  </Styles>
);

render(<App />, document.getElementById("root"));
