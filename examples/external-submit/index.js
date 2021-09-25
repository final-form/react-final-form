import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const App = () => {
  let submit;
  return (
    <Styles>
      <h1>
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form Example
      </h1>
      <h2>External Submit</h2>
      <a href="https://github.com/erikras/react-final-form#-react-final-form">
        Read Docs
      </a>
      <div className="buttons">
        <button
          type="submit"
          onClick={() =>
            // { cancelable: true } required for Firefox
            // https://github.com/facebook/react/issues/12639#issuecomment-382519193
            document
              .getElementById("exampleForm")
              .dispatchEvent(
                new Event("submit", { cancelable: true, bubbles: true }),
              )
          }
        >
          External Submit via <code>document.getElementById()</code>
        </button>
        <button
          type="submit"
          onClick={(event) => {
            submit(event);
          }}
          style={{ marginTop: 10 }}
        >
          External Submit via closure
        </button>
        <button type="submit" form="exampleForm" style={{ marginTop: 10 }}>
          External Submit via form attribute
        </button>
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => {
          submit = handleSubmit;
          return (
            <form id="exampleForm" onSubmit={handleSubmit}>
              <div>
                <label>First Name</label>
                <Field
                  name="firstName"
                  component="input"
                  type="text"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label>Last Name</label>
                <Field
                  name="lastName"
                  component="input"
                  type="text"
                  placeholder="Last Name"
                />
              </div>
              <div>
                <label>Favorite Color</label>
                <Field name="favoriteColor" component="select">
                  <option />
                  <option value="#ff0000">
                    <span role="img" aria-label="red heart">
                      ❤️
                    </span>{" "}
                    Red
                  </option>
                  <option value="#00ff00">
                    <span role="img" aria-label="green heart">
                      💚
                    </span>{" "}
                    Green
                  </option>
                  <option value="#0000ff">
                    <span role="img" aria-label="blue heart">
                      💙
                    </span>{" "}
                    Blue
                  </option>
                </Field>
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
          );
        }}
      />
    </Styles>
  );
};

render(<App />, document.getElementById("root"));
