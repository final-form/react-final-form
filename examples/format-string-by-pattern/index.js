import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import formatString from "format-string-by-pattern";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const masks = [
  { name: "phone-1", parse: "999-999-9999" },
  { name: "phone-2", parse: "(999) 999-9999" },
  { name: "phone-3", parse: "+49 (AAAA) BBBBBB" },
  { name: "cep 🇧🇷", parse: "12345-678" },
  { name: "cpf 🇧🇷", parse: "XXX.XXX.XXX-XX" },
  { name: "cnpj 🇧🇷", parse: "XX.XXX.XXX/XXXX-XX" },
];

const App = () => (
  <Styles>
    <h1>
      <span role="img" aria-label="final form flag">
        🏁
      </span>{" "}
      React Final Form
    </h1>
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, reset, submitting, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          {masks.map((mask) => (
            <div key={mask.name}>
              <label>{mask.name}</label>
              <Field
                component="input"
                name={mask.name}
                parse={formatString(mask.parse)}
                placeholder={mask.parse}
              />
            </div>
          ))}
          <div className="buttons">
            <button type="submit" disabled={submitting || pristine}>
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
