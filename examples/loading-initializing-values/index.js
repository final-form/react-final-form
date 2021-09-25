import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const load = async () => {
  await sleep(2000);
  return {
    username: "erikras",
    firstName: "Erik",
  };
};

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

class App extends React.Component {
  state = { data: {} };
  async componentDidMount() {
    this.setState({ loading: true });
    const data = await load();
    this.setState({ loading: false, data });
  }

  render() {
    return (
      <Styles>
        <h1>
          <span role="img" aria-label="final form flag">
            🏁
          </span>{" "}
          React Final Form - Loading and Initializing Values
        </h1>
        <a href="https://github.com/erikras/react-final-form#-react-final-form">
          Read Docs
        </a>
        <Form
          onSubmit={onSubmit}
          initialValues={this.state.data}
          render={({ handleSubmit, pristine, form, submitting, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                {this.state.loading && <div className="loading" />}
                <div>
                  <label>Username</label>
                  <Field
                    name="username"
                    component="input"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label>First Name</label>
                  <Field
                    name="firstName"
                    component="input"
                    placeholder="First Name"
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
            );
          }}
        />
      </Styles>
    );
  }
}

render(<App />, document.getElementById("root"));
