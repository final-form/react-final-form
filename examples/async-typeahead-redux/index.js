import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import Styles from "./Styles";
import { Form } from "react-final-form";
import setFieldData from "final-form-set-field-data";

import configureStore from "./store";
import GithubUserTypeahead from "./GithubUserTypeahead";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const store = configureStore();

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <Form
      onSubmit={onSubmit}
      initialValues={{ user1: null, user2: null }}
      mutators={{ setFieldData }}
      render={({ handleSubmit, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Github users</label>
            <GithubUserTypeahead name="user1" />
          </div>
          <div>
            <label>Github users 2</label>
            <GithubUserTypeahead name="user2" />
          </div>
          <div className="buttons">
            <button type="submit" disabled={submitting || pristine}>
              Submit
            </button>
          </div>
          <pre>{JSON.stringify(values, 0, 2)}</pre>
        </form>
      )}
    />
  </Styles>
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root"),
);
