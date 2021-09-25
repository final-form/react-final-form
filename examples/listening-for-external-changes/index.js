import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import createDecorator from "final-form-calculate";
import ExternalModificationDetector from "./ExternalModificationDetector";
import BooleanDecay from "./BooleanDecay";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const calculator = createDecorator({
  field: /day\[\d\]/, // when a field matching this pattern changes...
  updates: {
    // ...update the total to the result of this function
    total: (ignoredValue, allValues) =>
      (allValues.day || []).reduce((sum, value) => sum + Number(value || 0), 0),
  },
});

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form Example
    </h1>
    <h2>Listening for External Changes</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      By wrapping a stateful <code>ExternalModificationDetector</code> component
      in a <code>Field</code> component, we can listen for changes to a field's
      value, and by knowing whether or not the field is active, deduce when a
      field's value changes due to external influences.
    </p>
    <p>
      As you enter numbers for each day of the week, the total is calulated in
      realtime.
    </p>
    <Form
      onSubmit={onSubmit}
      decorators={[calculator]}
      render={({ handleSubmit, form, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
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
            <ExternalModificationDetector name="total">
              {(externallyModified) => (
                <BooleanDecay value={externallyModified} delay={1000}>
                  {(highlight) => (
                    <Field
                      name="total"
                      component="input"
                      type="number"
                      placeholder="Total"
                      style={{
                        transition: "background 500ms ease-in-out",
                        background: highlight ? "yellow" : "none",
                      }}
                    />
                  )}
                </BooleanDecay>
              )}
            </ExternalModificationDetector>
          </div>
          <hr />
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
