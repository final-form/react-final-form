import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

/************ IMPORTANT CODE STARTS HERE **************/
const FieldPrefixContext = React.createContext();
const FieldPrefix = ({ prefix, children }) => (
  <FieldPrefixContext.Provider value={prefix}>
    {children}
  </FieldPrefixContext.Provider>
);
const PrefixedField = ({ name, ...props }) => (
  <FieldPrefixContext.Consumer>
    {(prefix) => <Field name={`${prefix}.${name}`} {...props} />}
  </FieldPrefixContext.Consumer>
);
/************* IMPORTANT CODE ENDS HERE ***************/

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>Prefixed Fields Example</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      This example shows how to use React Context to create sections of your
      form that have their fields' names prefixed, to structure the resulting
      form data. This provides similar functionality to Redux Form's{" "}
      <a
        href="https://redux-form.com/8.2.2/docs/api/formsection.md/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <code>FormSection</code>
      </a>{" "}
      component.
    </p>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <h3>Shipping</h3>
          <FieldPrefix prefix="shipping">
            <div>
              <label>Street</label>
              <PrefixedField
                name="street"
                component="input"
                type="text"
                placeholder="Street"
              />
            </div>
            <div>
              <label>City</label>
              <PrefixedField
                name="city"
                component="input"
                type="text"
                placeholder="City"
              />
            </div>
          </FieldPrefix>
          <h3>Billing</h3>
          <FieldPrefix prefix="billing">
            <div>
              <label>Street</label>
              <PrefixedField
                name="street"
                component="input"
                type="text"
                placeholder="Street"
              />
            </div>
            <div>
              <label>City</label>
              <PrefixedField
                name="city"
                component="input"
                type="text"
                placeholder="City"
              />
            </div>
          </FieldPrefix>
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
);

render(<App />, document.getElementById("root"));
