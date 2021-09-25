import React from "react";
import { render } from "react-dom";
import { Form, Field } from "react-final-form";
import {
  Box,
  Button,
  Checkbox,
  Col,
  ControlFeedback,
  FormCheck,
  FormCheckLabel,
  FormGroup,
  Input,
  Label,
  Radio,
  RadioGroup,
  Row,
  Select,
  Textarea,
  Typography,
} from "smooth-ui";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const onSubmit = async (values) => {
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

// ****************************************
//⬇️ THIS IS WHERE ALL THE MAGIC HAPPENS ⬇️
// ****************************************
const adapt /* ⬅️ this is a HOC */ =
  (Component) =>
  ({ input, meta: { valid }, ...rest }) =>
    <Component {...input} {...rest} valid={valid} />;
const AdaptedInput = adapt(Input);
const AdaptedCheckbox = adapt(Checkbox);
const AdaptedRadio = adapt(Radio);
const AdaptedSelect = adapt(Select);
const AdaptedTextarea = adapt(Textarea);

const Error = ({ name }) => (
  <Field name={name} subscription={{ error: true, touched: true }}>
    {({ meta: { touched, error } }) =>
      touched && error ? (
        <ControlFeedback valid={!error}>{error}</ControlFeedback>
      ) : null
    }
  </Field>
);
// ****************************************
//⬆️ THIS IS WHERE ALL THE MAGIC HAPPENS ⬆️
// ****************************************

const required = (value) => (value ? undefined : "Required");
const App = () => (
  <Row>
    <Col />
    <Col xs={8}>
      <Typography variant="h1">
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form
      </Typography>
      <Typography variant="h2">
        <span role="img" aria-label="lollipop">
          🍭
        </span>{" "}
        Smooth-UI Example
      </Typography>
      <p>
        This example demonstrates how to use{" "}
        <a
          href="https://smooth-ui.smooth-code.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span role="img" aria-label="lollipop">
            🍭
          </span>{" "}
          Smooth-UI
        </a>{" "}
        to make your forms look fabulous. All you really need is the
        higher-order component that adapts the{" "}
        <span role="img" aria-label="lollipop">
          🍭
        </span>{" "}
        Smooth-UI form components to be compatible with{" "}
        <span role="img" aria-label="final form flag">
          🏁
        </span>{" "}
        React Final Form.
      </p>
      <Form
        onSubmit={onSubmit}
        initialValues={{ stooge: "larry", employed: true }}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>First Name</Label>
              <Field
                name="firstName"
                component={AdaptedInput}
                placeholder="First Name"
                validate={required}
                control
              />
              <Error name="firstName" />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Field
                name="lastName"
                component={AdaptedInput}
                placeholder="Last Name"
                validate={required}
                control
              />
              <Error name="lastName" />
            </FormGroup>
            <FormCheck>
              <Field
                name="employed"
                component={AdaptedCheckbox}
                type="checkbox"
                id="employed"
              />
              <FormCheckLabel htmlFor="employed">Employed</FormCheckLabel>
            </FormCheck>
            <FormGroup>
              <Label>Favorite Color</Label>
              <Field
                name="favoriteColor"
                component={AdaptedSelect}
                validate={required}
                options={[
                  {},
                  { value: "#ff0000", label: "❤️ Red" },
                  { value: "#00ff00", label: "💚 Green" },
                  { value: "#0000ff", label: "💙 Blue" },
                ]}
                control
              />
              <Error name="favoriteColor" />
            </FormGroup>
            <FormGroup>
              <Label>Toppings</Label>
              <Field
                name="toppings"
                component={AdaptedSelect}
                validate={required}
                multiple
                arrow={false}
                options={[
                  { value: "chicken", label: "🐓 Chicken" },
                  { value: "ham", label: "🐷 Ham" },
                  { value: "mushrooms", label: "🍄 Mushrooms" },
                  { value: "cheese", label: "🧀 Cheese" },
                  { value: "tuna", label: "🐟 Tuna" },
                  { value: "pineapple", label: "🍍 Pineapple" },
                ]}
                control
              />
              <Error name="toppings" />
            </FormGroup>
            <FormGroup>
              <Label>Sauces</Label>
              <FormCheck>
                <Field
                  name="sauces"
                  component={AdaptedCheckbox}
                  id="ketchup"
                  type="checkbox"
                  value="ketchup"
                />
                <FormCheckLabel htmlFor="ketchup">Ketchup</FormCheckLabel>
              </FormCheck>
              <FormCheck>
                <Field
                  name="sauces"
                  component={AdaptedCheckbox}
                  id="mayonnaise"
                  type="checkbox"
                  value="mayonnaise"
                />
                <FormCheckLabel htmlFor="mayonnaise">Mayonnaise</FormCheckLabel>
              </FormCheck>
              <FormCheck>
                <Field
                  name="sauces"
                  component={AdaptedCheckbox}
                  id="guacamole"
                  type="checkbox"
                  value="guacamole"
                />
                <FormCheckLabel htmlFor="guacamole">
                  Guacamole{" "}
                  <span role="img" aria-label="guacamole">
                    🥑
                  </span>
                </FormCheckLabel>
              </FormCheck>
            </FormGroup>

            <FormGroup>
              <Label>Best Stooge</Label>
              <RadioGroup>
                <FormCheck>
                  <Field
                    name="stooge"
                    component={AdaptedRadio}
                    type="radio"
                    id="larry"
                    value="larry"
                  />
                  <FormCheckLabel htmlFor="larry">Larry</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <Field
                    name="stooge"
                    component={AdaptedRadio}
                    type="radio"
                    id="moe"
                    value="moe"
                  />
                  <FormCheckLabel htmlFor="moe">Moe</FormCheckLabel>
                </FormCheck>
                <FormCheck>
                  <Field
                    name="stooge"
                    component={AdaptedRadio}
                    type="radio"
                    id="curly"
                    value="curly"
                  />
                  <FormCheckLabel htmlFor="curly">Curly</FormCheckLabel>
                </FormCheck>
              </RadioGroup>
            </FormGroup>
            <FormGroup>
              <Label>Notes</Label>
              <Field
                name="notes"
                component={AdaptedTextarea}
                placeholder="Notes"
                validate={required}
                control
              />
              <Error name="notes" />
            </FormGroup>
            <Box justifyContent="space-around">
              <Button
                type="submit"
                disabled={submitting || pristine}
                variant="primary"
              >
                Submit
              </Button>
              <Button
                type="button"
                onClick={form.reset}
                disabled={submitting || pristine}
                variant="secondary"
              >
                Reset
              </Button>
            </Box>
            <pre
              style={{
                border: "1px solid #ccc",
                background: "rgba(0, 0, 0, 0.1)",
                boxShadow: "inset 1px 1px 3px rgba(0, 0, 0, 0.2)",
                padding: "20px",
              }}
            >
              {JSON.stringify(values, 0, 2)}
            </pre>
          </form>
        )}
      />
    </Col>
    <Col />
  </Row>
);

render(<App />, document.getElementById("root"));
