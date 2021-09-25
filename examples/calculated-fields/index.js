import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import createDecorator from "final-form-calculate";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const calculator = createDecorator(
  {
    field: "minimum", // when minimum changes...
    updates: {
      // ...update maximum to the result of this function
      maximum: (minimumValue, allValues) =>
        Math.max(minimumValue || 0, allValues.maximum || 0),
    },
  },
  {
    field: "maximum", // when maximum changes...
    updates: {
      // update minimum to the result of this function
      minimum: (maximumValue, allValues) =>
        Math.min(maximumValue || 0, allValues.minimum || 0),
    },
  },
  {
    field: /day\[\d\]/, // when a field matching this pattern changes...
    updates: {
      // ...update the total to the result of this function
      total: (ignoredValue, allValues) =>
        (allValues.day || []).reduce(
          (sum, value) => sum + Number(value || 0),
          0,
        ),
    },
  },
);

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form Example
    </h1>
    <h2>Calculated Fields</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      Change the minimum and maximum values with the arrow keys and notice that
      the other updates so that minimum is always &lt;= maximum.
    </p>
    <p>
      As you enter numbers for each day of the week, the total is calulated in
      realtime.
    </p>
    <Form
      onSubmit={onSubmit}
      decorators={[calculator]}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Minimum</label>
            <Field
              name="minimum"
              component="input"
              type="number"
              placeholder="Minimum"
            />
          </div>
          <div>
            <label>Maximum</label>
            <Field
              name="maximum"
              component="input"
              type="number"
              placeholder="Maximum"
            />
          </div>
          <hr />
          <div>
            <label>Monday</label>
            <Field
              name="day[0]"
              component="input"
              type="number"
              placeholder="Monday"
            />
          </div>
          <div>
            <label>Tuesday</label>
            <Field
              name="day[1]"
              component="input"
              type="number"
              placeholder="Tuesday"
            />
          </div>
          <div>
            <label>Wednesday</label>
            <Field
              name="day[2]"
              component="input"
              type="number"
              placeholder="Wednesday"
            />
          </div>
          <div>
            <label>Thursday</label>
            <Field
              name="day[3]"
              component="input"
              type="number"
              placeholder="Thursday"
            />
          </div>
          <div>
            <label>Friday</label>
            <Field
              name="day[4]"
              component="input"
              type="number"
              placeholder="Friday"
            />
          </div>
          <hr />
          <div>
            <label>Total</label>
            <Field
              name="total"
              component="input"
              type="number"
              readOnly
              placeholder="Total"
            />
          </div>
          <hr />
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
        </form>
      )}
    />
  </Styles>
);

render(<App />, document.getElementById("root"));
