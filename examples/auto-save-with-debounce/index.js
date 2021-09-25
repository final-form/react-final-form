import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import AutoSave from "./AutoSave";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const save = async (values) => {
  console.log("Saving", values);
  await sleep(2000);
};

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <h2>Auto-Save with Debounce</h2>
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
      to listen to changes to values and auto-save changes. Look in the console
      for the save events.
    </p>
    <Form
      onSubmit={save /* NOT USED, but required */}
      initialValues={{ employed: true, stooge: "larry" }}
      subscription={{} /* No need to subscribe to anything */}
    >
      {() => (
        <div className="form">
          {/* Don't even need a <form> tag */}

          {/* 👇 👇 👇 👇 */}
          <AutoSave debounce={1000} save={save} />
          {/* ☝️ ️☝️ ️☝️ ️️️️☝️ ️️*/}

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
            <label>Email</label>
            <Field
              name="email"
              component="input"
              type="email"
              placeholder="Email"
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
          <div>
            <label>Employed?</label>
            <Field name="employed" component="input" type="checkbox" />
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
          </div>
          <div>
            <label>Notes</label>
            <Field name="notes" component="textarea" placeholder="Notes" />
          </div>
        </div>
      )}
    </Form>
  </Styles>
);

render(<App />, document.getElementById("root"));
