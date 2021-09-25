import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const WhenFieldChanges = ({ field, becomes, set, to }) => (
  <Field name={set} subscription={{}}>
    {(
      // No subscription. We only use Field to get to the change function
      { input: { onChange } },
    ) => (
      <OnChange name={field}>
        {(value) => {
          if (value === becomes) {
            onChange(to);
          }
        }}
      </OnChange>
    )}
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
    <h2>Declarative Form Rules</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      This example demonstrates how to use{" "}
      <a
        href="https://github.com/final-form/react-final-form-listeners#-react-final-form-listeners"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form Listeners
      </a>{" "}
      to listen to the change of one field to then update the value of other
      fields.
    </p>
    <p>
      When you uncheck "Is this a gift?", the other two fields are cleared and
      disabled.
    </p>
    <Form
      onSubmit={onSubmit}
      initialValues={{ gift: true }}
      render={({
        handleSubmit,
        form,
        submitting,
        pristine,
        values,
        errors,
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <WhenFieldChanges
              field="gift"
              becomes={false}
              set="giftWrap"
              to={false}
            />
            <WhenFieldChanges
              field="gift"
              becomes={false}
              set="giftCardMessage"
              to={undefined}
            />
            <div>
              <label>Is this a gift?</label>
              <Field name="gift" component="input" type="checkbox" />
            </div>
            <div>
              <label>Gift wrap?</label>
              <Field
                name="giftWrap"
                component="input"
                type="checkbox"
                disabled={!values.gift}
              />
            </div>
            <div>
              <label>Message</label>
              <Field
                name="giftCardMessage"
                component="textarea"
                disabled={!values.gift}
                placeholder="What do you want the card to say?"
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
            <h2>Data</h2>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        );
      }}
    />
  </Styles>
);
render(<App />, document.getElementById("root"));
