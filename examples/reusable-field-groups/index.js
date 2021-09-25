import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const Address = ({ name, label }) => (
  <React.Fragment>
    <div>
      <label>{label} Street</label>
      <Field
        name={`${name}.street`}
        component="input"
        placeholder={`${label} Street`}
      />
    </div>
    <div>
      <label>{label} City</label>
      <Field
        name={`${name}.city`}
        component="input"
        placeholder={`${label} City`}
      />
    </div>
    <div>
      <label>{label} Postal Code</label>
      <Field
        name={`${name}.postalCode`}
        component="input"
        placeholder={`${label} Postal Code`}
      />
    </div>
  </React.Fragment>
);

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form Example
    </h1>
    <h2>Reusable Field Groups</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <Field name="name" component="input" placeholder="Name" />
          </div>
          <Address name="billing" label="Billing" />
          <Address name="shipping" label="Shipping" />
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
