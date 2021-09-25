import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field, FormSpy } from "react-final-form";
import RenderCount from "./RenderCount";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};
const required = (value) => (value ? undefined : "Required");

const App = () => (
  <Styles>
    <h1>React Final Form Example</h1>
    <h2>Performance Optimization Through Subscriptions</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      In this example, the numbers in the circles are the number of times that
      component has been rendered.
    </p>
    <p>
      The top form, with no specified subscription, rerenders the whole form and
      every input on every change.
    </p>
    <MyForm />
    <p>
      The bottom form subscribes only to the changes it needs to update. By not
      rerendering the whole form on every change, the fields, too, become
      independent. Notice that we must now use a <code>FormSpy</code> component
      to show the values in realtime.
    </p>
    <MyForm subscription={{ submitting: true, pristine: true }} />
  </Styles>
);

const MyForm = ({ subscription }) => (
  <Form
    onSubmit={onSubmit}
    subscription={subscription}
    render={({ handleSubmit, form, submitting, pristine, values }) => (
      <form onSubmit={handleSubmit}>
        <RenderCount />
        <Field name="firstName" validate={required}>
          {({ input, meta }) => (
            <div>
              <RenderCount />
              <label>First Name</label>
              <input {...input} placeholder="First Name" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>
        <Field name="lastName" validate={required}>
          {({ input, meta }) => (
            <div>
              <RenderCount />
              <label>Last Name</label>
              <input {...input} placeholder="Last Name" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>
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
        {values ? (
          <pre>
            <RenderCount />
            {JSON.stringify(values, 0, 2)}
          </pre>
        ) : (
          <FormSpy subscription={{ values: true }}>
            {({ values }) => (
              <pre>
                <RenderCount />
                {JSON.stringify(values, 0, 2)}
              </pre>
            )}
          </FormSpy>
        )}
      </form>
    )}
  />
);

render(<App />, document.getElementById("root"));
