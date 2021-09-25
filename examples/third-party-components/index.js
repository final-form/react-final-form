import React from "react";
import { render } from "react-dom";
import Styles from "./Styles";
import { Form, Field } from "react-final-form";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import TextField from "material-ui/TextField";
import Toggle from "material-ui/Toggle";
import Select from "react-select";
import states from "./states";

const TextFieldAdapter = ({ input, meta, ...rest }) => (
  <TextField
    {...input}
    {...rest}
    onChange={(event, value) => input.onChange(value)}
    errorText={meta.touched ? meta.error : ""}
  />
);

const ToggleAdapter = ({ input: { onChange, value }, label, ...rest }) => (
  <Toggle
    label={label}
    toggled={!!value}
    onToggle={(event, isInputChecked) => onChange(isInputChecked)}
    {...rest}
  />
);

const ReactSelectAdapter = ({ input, ...rest }) => (
  <Select {...input} {...rest} searchable />
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};
const required = (value) => (value ? undefined : "Required");

const App = () => (
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Styles>
      <h1>
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form Example
      </h1>
      <h2>Third Party Components</h2>
      <a href="https://github.com/erikras/react-final-form#-react-final-form">
        Read Docs
      </a>
      <div>
        This example uses{" "}
        <a href="https://github.com/JedWatson/react-select">React Select</a> and{" "}
        <a href="http://www.material-ui.com">Material UI</a>.
      </div>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <div>
              <Field
                name="firstName"
                component={TextFieldAdapter}
                validate={required}
                hintText="First Name"
                floatingLabelText="First Name"
              />
            </div>
            <div>
              <Field
                name="state"
                component={ReactSelectAdapter}
                options={states}
              />
            </div>
            <div>
              <Field
                name="employed"
                label="Employed?"
                component={ToggleAdapter}
                labelPosition="right"
              />
            </div>
            <div className="buttons">
              <button type="submit" disabled={submitting}>
                Log In
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
  </MuiThemeProvider>
);

render(<App />, document.getElementById("root"));
