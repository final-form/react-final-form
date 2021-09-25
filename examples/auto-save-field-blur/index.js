import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import setFieldData from "final-form-set-field-data";
import AutoSave from "./AutoSave";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const save = async (values) => {
  console.log("Saving", values);
  await sleep(1000);
};

const SavingIndicator = ({ name }) => (
  <Field
    name={name}
    subscription={{ data: true }}
    render={({
      meta: {
        data: { saving },
      },
    }) => (saving ? <div className="saving">Saving</div> : null)}
  />
);

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>Auto-Save on Field Blur</h2>
    <a href="https://github.com/erikras/react-final-form#-react-final-form">
      Read Docs
    </a>
    <p>
      The <code>AutoSave</code> component uses{" "}
      <a
        href="https://github.com/final-form/react-final-form#formspy--reactcomponenttypeformspyprops"
        target="_blank"
        rel="noopener noreferrer"
      >
        <code>FormSpy</code>
      </a>{" "}
      to listen to changes to values and which field is currently active and
      auto-saves changes when a field is blurred. Look in the console for the
      save events.
    </p>
    <Form
      onSubmit={save /* NOT USED, but required */}
      initialValues={{ employed: true, stooge: "larry" }}
      mutators={{ setFieldData }}
      subscription={{} /* No need to subscribe to anything */}
    >
      {({ form }) => (
        <div className="form">
          {/* Don't even need a <form> tag */}

          {/* 👇 👇 👇 👇 */}
          <AutoSave setFieldData={form.mutators.setFieldData} save={save} />
          {/* ☝️ ️☝️ ️☝️ ️️️️☝️ ️️*/}

          <div>
            <label>First Name</label>
            <Field
              name="firstName"
              component="input"
              type="text"
              placeholder="First Name"
            />
            <SavingIndicator name="firstName" />
          </div>
          <div>
            <label>Last Name</label>
            <Field
              name="lastName"
              component="input"
              type="text"
              placeholder="Last Name"
            />
            <SavingIndicator name="lastName" />
          </div>
          <div>
            <label>Email</label>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="Email"
            />
            <SavingIndicator name="email" />
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
            <SavingIndicator name="favoriteColor" />
          </div>
          <div>
            <label>Employed?</label>
            <Field name="employed" component="input" type="checkbox" />
            <SavingIndicator name="employed" />
          </div>
          <div>
            <label>Toppings</label>
            <Field name="toppings" component="select" multiple>
              <option value="ham">
                <span role="img" aria-label="pig head">
                  🐷
                </span>{" "}
                Ham
              </option>
              <option value="mushrooms">
                <span role="img" aria-label="mushroom">
                  🍄
                </span>{" "}
                Mushrooms
              </option>
              <option value="cheese">
                <span role="img" aria-label="cheese">
                  🧀
                </span>{" "}
                Cheese
              </option>
              <option value="chicken">
                <span role="img" aria-label="chicken">
                  🐓
                </span>{" "}
                Chicken
              </option>
              <option value="pineapple">
                <span role="img" aria-label="pineapple">
                  🍍
                </span>{" "}
                Pinapple
              </option>
            </Field>
            <SavingIndicator name="toppings" />
          </div>
          <div>
            <label>Best Stooge?</label>
            <div>
              <label>
                <Field
                  name="stooge"
                  component="input"
                  type="radio"
                  value="larry"
                />{" "}
                Larry
              </label>
              <label>
                <Field
                  name="stooge"
                  component="input"
                  type="radio"
                  value="moe"
                />{" "}
                Moe
              </label>
              <label>
                <Field
                  name="stooge"
                  component="input"
                  type="radio"
                  value="curly"
                />{" "}
                Curly
              </label>
            </div>
            <SavingIndicator name="stooge" />
          </div>
          <div>
            <label>Notes</label>
            <Field name="notes" component="textarea" placeholder="Notes" />
            <SavingIndicator name="notes" />
          </div>
        </div>
      )}
    </Form>
  </Styles>
);

render(<App />, document.getElementById("root"));
