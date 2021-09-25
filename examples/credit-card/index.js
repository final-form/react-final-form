import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import Card from "./Card";
import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate,
} from "./cardUtils";

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
      React Final Form
    </h1>
    <h2>Credit Card Example</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      This example demonstrates how to use the amazing{" "}
      <a
        href="https://github.com/amarofashion/react-credit-cards"
        target="_blank"
        rel="noopener noreferrer"
      >
        React Credit Cards
      </a>{" "}
      library with your form.
    </p>
    <Form
      onSubmit={onSubmit}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        active,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Card
              number={values.number || ""}
              name={values.name || ""}
              expiry={values.expiry || ""}
              cvc={values.cvc || ""}
              focused={active}
            />
            <div>
              <Field
                name="number"
                component="input"
                type="text"
                pattern="[\d| ]{16,22}"
                placeholder="Card Number"
                format={formatCreditCardNumber}
              />
            </div>
            <div>
              <Field
                name="name"
                component="input"
                type="text"
                placeholder="Name"
              />
            </div>
            <div>
              <Field
                name="expiry"
                component="input"
                type="text"
                pattern="\d\d/\d\d"
                placeholder="Valid Thru"
                format={formatExpirationDate}
              />
              <Field
                name="cvc"
                component="input"
                type="text"
                pattern="\d{3,4}"
                placeholder="CVC"
                format={formatCVC}
              />
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
            <h2>Values</h2>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        );
      }}
    />
  </Styles>
);

render(<App />, document.getElementById("root"));
