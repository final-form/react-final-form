import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Field } from "react-final-form";
import LoadSaveReinitializeForm from "./LoadSaveReinitializeForm";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let record = {
  primaryKey: 42,
  phone: "2045551234",
  name: "John Doe",
  email: "john.doe@final-form.org",
  otherExtraneousInfo: {
    creditScore: 800,
  },
};

const load = async () => {
  console.info("Loading...");
  await sleep(1500);
  console.info("Loaded...");
  return record;
};

const save = async (values) => {
  console.info("Saving", values);
  await sleep(1500);
  record = values;
};

const postLoadFormat = (values) => {
  const { name, email, phone } = values;
  const [firstName, lastName] = name.split(/ /, 2);
  return {
    firstName,
    lastName,
    email,
    phone: phone
      ? `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6, 10)}`
      : "",
  };
};

const preSaveFormat = (values, originalValues) => {
  return {
    ...originalValues,
    name: `${values.firstName || ""} ${values.lastName || ""}`,
    email: values.email,
    phone: values.phone.replace(/-/g, ""),
  };
};

const Error = ({ name }) => (
  <Field
    name={name}
    subscription={{ error: true, touched: true }}
    render={({ meta: { error, touched } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
);

const loading = <div className="loading">Loading...</div>;

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "Required";
  }
  if (!values.lastName) {
    errors.lastName = "Required";
  }
  if (!values.email) {
    errors.email = "Required";
  }
  if (!values.phone) {
    errors.phone = "Required";
  }
  return errors;
};
const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>Load, Save, and Reinitialize</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      <code>LoadSaveReinitializeForm</code> is a wrapper for a{" "}
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form component. On mount, it loads a record from the
      database/API, and formats it to the shape of the form inputs. On submit,
      it converts the data back to the format that the database/API wants
      (including the original primary key), saves the data to the database/API,
      and then re-initializes the form so that it is pristine again with the
      canonical data.
    </p>
    <LoadSaveReinitializeForm
      load={load}
      loading={loading}
      postLoadFormat={postLoadFormat}
      preSaveFormat={preSaveFormat}
      save={save}
      validate={validate}
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
              disabled={submitting}
            />
            <Error name="firstName" />
          </div>
          <div>
            <label>Last Name</label>
            <Field
              name="lastName"
              component="input"
              type="text"
              placeholder="Last Name"
              disabled={submitting}
            />
            <Error name="lastName" />
          </div>
          <div>
            <label>Email</label>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="Email"
              disabled={submitting}
            />
            <Error name="email" />
          </div>
          <div>
            <label>Phone</label>
            <Field
              name="phone"
              component="input"
              type="text"
              placeholder="Phone"
              disabled={submitting}
            />
            <Error name="phone" />
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
          <h3>Form Values</h3>
          <pre>{JSON.stringify(values, 0, 2)}</pre>
          <h3>Database Record</h3>
          <pre>{JSON.stringify(record, 0, 2)}</pre>
        </form>
      )}
    </LoadSaveReinitializeForm>
  </Styles>
);

render(<App />, document.getElementById("root"));
