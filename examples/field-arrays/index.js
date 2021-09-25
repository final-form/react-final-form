import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";

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
      React Final Form - Array Fields
    </h1>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <Form
      onSubmit={onSubmit}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        }, // injected from final-form-arrays above
        pristine,
        form,
        submitting,
        values,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Company</label>
              <Field name="company" component="input" />
            </div>
            <div className="buttons">
              <button
                type="button"
                onClick={() => push("customers", undefined)}
              >
                Add Customer
              </button>
              <button type="button" onClick={() => pop("customers")}>
                Remove Customer
              </button>
            </div>
            <FieldArray name="customers">
              {({ fields }) =>
                fields.map((name, index) => (
                  <div key={name}>
                    <label>Cust. #{index + 1}</label>
                    <Field
                      name={`${name}.firstName`}
                      component="input"
                      placeholder="First Name"
                    />
                    <Field
                      name={`${name}.lastName`}
                      component="input"
                      placeholder="Last Name"
                    />
                    <span
                      onClick={() => fields.remove(index)}
                      style={{ cursor: "pointer" }}
                      role="img"
                      aria-label="remove customer icon"
                    >
                      ❌
                    </span>
                  </div>
                ))
              }
            </FieldArray>

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
        );
      }}
    />
  </Styles>
);

render(<App />, document.getElementById("root"));
