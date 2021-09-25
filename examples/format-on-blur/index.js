import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import numeral from "numeral";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const formatPrice = (value) =>
  value === undefined
    ? "" // make controlled
    : numeral(value).format("$0,0.00");

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>Format On Blur Example</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      By default the <code>format</code> function given to <code>Field</code> is
      called every time the component is rendered. But that can lead to a
      difficult UX for some types of values. That's why there is a{" "}
      <code>formatOnBlur</code> flag that will prevent the <code>format</code>{" "}
      function from being called until the field is blurred.
    </p>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Product Name</label>
            <Field
              name="name"
              component="input"
              type="text"
              placeholder="Product Name"
            />
          </div>
          <div>
            <label>Price</label>
            <Field
              name="price"
              component="input"
              type="text"
              format={formatPrice}
              formatOnBlur
              placeholder="$0.00"
            />
          </div>
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
