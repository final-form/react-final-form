import React from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'react-final-form';
import {
  TextField,
  Checkboxes,
  Radios,
  Select,
  DatePicker,
  TimePicker,
} from 'mui-rff';
import {
  Typography,
  Paper,
  Link,
  Grid,
  Button,
  CssBaseline,
  MenuItem,
} from '@material-ui/core';
// Picker
import DateFnsUtils from '@date-io/date-fns';

const onSubmit = async (values) => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(300);
  window.alert(JSON.stringify(values, 0, 2));
};

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  return errors;
};

const formFields = [
  {
    size: 6,
    field: (
      <TextField
        label="First Name"
        name="firstName"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 6,
    field: (
      <TextField
        label="Last Name"
        name="lastName"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 12,
    field: (
      <TextField
        type="email"
        label="Email"
        name="email"
        margin="none"
        required={true}
      />
    ),
  },
  {
    size: 12,
    field: (
      <Checkboxes
        name="employed"
        formControlProps={{ margin: 'none' }}
        data={{ label: 'Employed', value: true }}
      />
    ),
  },
  {
    size: 12,
    field: (
      <Radios
        label="Best Stooge"
        name="stooge"
        formControlProps={{ margin: 'none' }}
        radioGroupProps={{ row: true }}
        data={[
          { label: 'Larry', value: 'larry' },
          { label: 'Moe', value: 'moe' },
          { label: 'Curly', value: 'curly' },
        ]}
      />
    ),
  },
  {
    size: 12,
    field: (
      <Checkboxes
        label="Sauces"
        name="sauces"
        formControlProps={{ margin: 'none' }}
        formGroupProps={{ row: true }}
        data={[
          { label: 'Ketchup', value: 'ketchup' },
          { label: 'Mustard', value: 'mustard' },
          { label: 'Salsa', value: 'salsa' },
          { label: 'Guacamole 🥑', value: 'guacamole' },
        ]}
      />
    ),
  },
  {
    size: 12,
    field: <TextField name="notes" multiline label="Notes" margin="none" />,
  },
  {
    size: 12,
    field: (
      <Select
        name="city"
        label="Select a City"
        formControlProps={{ margin: 'none' }}
      >
        <MenuItem value="London">London</MenuItem>
        <MenuItem value="Paris">Paris</MenuItem>
        <MenuItem value="Budapest">A city with a very long Name</MenuItem>
      </Select>
    ),
  },
  {
    size: 6,
    field: (
      <DatePicker
        name="rendez-vous"
        margin="normal"
        label="Rendez-vous"
        dateFunsUtils={DateFnsUtils}
      />
    ),
  },
  {
    size: 6,
    field: (
      <TimePicker
        name="alarm"
        margin="normal"
        label="Alarm"
        dateFunsUtils={DateFnsUtils}
      />
    ),
  },
];

function App() {
  return (
    <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
      <CssBaseline />
      <Typography variant="h4" align="center" component="h1" gutterBottom>
        <span role="img" aria-label="flag">
          🏁
        </span>{' '}
        React Final Form
      </Typography>
      <Typography variant="h5" align="center" component="h2" gutterBottom>
        Material-UI Example
      </Typography>
      <Typography paragraph>
        <Link href="https://github.com/erikras/react-final-form#-react-final-form">
          Read Docs
        </Link>
        . This example demonstrates using{' '}
        <Link href="https://material-ui.com/demos/text-fields/">
          Material-UI
        </Link>{' '}
        form controls.
      </Typography>
      <Form
        onSubmit={onSubmit}
        initialValues={{ employed: true, stooge: 'larry' }}
        validate={validate}
        render={({ handleSubmit, reset, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit} noValidate>
            <Paper style={{ padding: 16 }}>
              <Grid container alignItems="flex-start" spacing={2}>
                {formFields.map((item, idx) => (
                  <Grid item xs={item.size} key={idx}>
                    {item.field}
                  </Grid>
                ))}
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={reset}
                    disabled={submitting || pristine}
                  >
                    Reset
                  </Button>
                </Grid>
                <Grid item style={{ marginTop: 16 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            <pre>{JSON.stringify(values, 0, 2)}</pre>
          </form>
        )}
      />
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector('#root'));
