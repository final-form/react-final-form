import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import pickupTimes from "./pickupTimes";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const Error = ({ name }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { error, touched } }) =>
      error && touched ? <span>{error}</span> : null
    }
  </Field>
);

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (value === is ? children : null)}
  </Field>
);

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>Conditional Fields</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      Sometimes you might want to conditionally show or hide some parts of your
      form depending on values the user has already provided for other form
      inputs.{" "}
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form makes that very easy to do by creating a{" "}
      <code>Condition</code> component out of a <code>Field</code> component.
    </p>
    <Form
      onSubmit={onSubmit}
      initialValues={{ employed: true, stooge: "larry" }}
      validate={(values) => {
        const errors = {};
        if (!values.firstName) {
          errors.firstName = "Required";
        }
        if (!values.reception) {
          errors.reception = "Required";
        }
        if (values.reception === "delivery") {
          if (!values.street) {
            errors.street = "Required";
          }
        } else if (values.reception === "pickup") {
          if (!values.pickupTime) {
            errors.pickupTime = "Required";
          }
        }
        return errors;
      }}
    >
      {({ handleSubmit, form, submitting, pristine, values }) => (
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
            <label>Transport</label>
            <div>
              <label>
                <Field
                  name="reception"
                  component="input"
                  type="radio"
                  value="delivery"
                />{" "}
                Delivery
              </label>
              <label>
                <Field
                  name="reception"
                  component="input"
                  type="radio"
                  value="pickup"
                />{" "}
                Pickup
              </label>
            </div>
            <Error name="reception" />
          </div>
          <Condition when="reception" is="delivery">
            <div>
              <label>Street</label>
              <Field
                name="street"
                component="input"
                type="text"
                placeholder="Street Address"
              />
              <Error name="street" />
            </div>
          </Condition>
          <Condition when="reception" is="pickup">
            <div>
              <label>Pickup Time</label>
              <Field name="pickupTime" component="select">
                <option />$
                {pickupTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </Field>
              <Error name="pickupTime" />
            </div>
          </Condition>
          <div>
            <label>Is it a gift?</label>
            <Field name="gift" component="input" type="checkbox" />
          </div>
          <Condition when="gift" is={true}>
            <div>
              <label>Gift Message</label>
              <Field
                name="message"
                component="textarea"
                placeholder="Gift Message"
              />
              <Error name="message" />
            </div>
          </Condition>
          <div className="buttons">
            <button type="submit" disabled={submitting}>
              Submit
            </button>
            <button type="button" onClick={form.reset} disabled={submitting}>
              Reset
            </button>
          </div>
          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    </Form>
  </Styles>
);

render(<App />, document.getElementById("root"));
