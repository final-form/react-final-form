/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react'
import { render } from 'react-dom'
import {
  Box,
  Button,
  ButtonGroup,
  CSSReset,
  Heading,
  Icon,
  Link,
  ThemeProvider,
  theme,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Checkbox,
  Progress,
  Radio,
  RadioGroup,
  Stack,
  Textarea
} from '@chakra-ui/core'
import { Form, Field, useField, useForm } from 'react-final-form'
import validate from './validate'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const App = () => (
  <ThemeProvider theme={theme}>
    <CSSReset />
    <Box w={500} p={4} m="20px auto">
      <Heading as="h1" size="xl" textAlign="center">
        React Final Form
      </Heading>
      <Heading as="h2" size="l" textAlign="center" m={5}>
        Chakra Example
      </Heading>
      <Box as="p" textAlign="center">
        Example using React Final Form and{' '}
        <Link href="https://chakra-ui.com" isExternal>
          Chakra <Icon name="external-link" mx="2px" />
        </Link>
        .
      </Box>
      <Box as="p" textAlign="center">
        <Link href="https://final-form.org/react" isExternal>
          Read Docs <Icon name="view" mx="2px" />
        </Link>
      </Box>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({
          handleSubmit,
          form,
          errors,
          submitting,
          pristine,
          values
        }) => (
          <Box
            as="form"
            p={4}
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            onSubmit={handleSubmit}
          >
            {/* 
            This example uses a mixture of custom field components using useField() 
            and components adapted to take the { input, meta } structure <Field/>
            provides
            */}
            <InputControl name="firstName" label="First Name" />
            <InputControl name="lastName" label="Last Name" />
            <CheckboxControl name="employed">Employed</CheckboxControl>
            <Field
              name="favoriteColor"
              component={AdaptedRadioGroup}
              label="Favorite Color"
            >
              <Radio value="#ff0000" color="red">
                Red
              </Radio>
              <Radio value="#00ff00" color="green">
                Green
              </Radio>
              <Radio value="#0000ff" color="blue">
                Blue
              </Radio>
            </Field>
            <Control name="toppings" my={4}>
              <FormLabel htmlFor="toppings">Toppings</FormLabel>
              <Stack pl={6} mt={1} spacing={1}>
                <CheckboxArrayControl name="toppings" value="chicken">
                  🐓 Chicken
                </CheckboxArrayControl>
                <CheckboxArrayControl name="toppings" value="ham">
                  🐷 Ham
                </CheckboxArrayControl>
                <CheckboxArrayControl name="toppings" value="mushrooms">
                  🍄 Mushrooms
                </CheckboxArrayControl>
                <CheckboxArrayControl name="toppings" value="cheese">
                  🧀 Cheese
                </CheckboxArrayControl>
                <CheckboxArrayControl name="toppings" value="tuna">
                  🐟 Tuna
                </CheckboxArrayControl>
                <CheckboxArrayControl name="toppings" value="pineapple">
                  🍍 Pineapple
                </CheckboxArrayControl>
              </Stack>
              <Error name="toppings" />
            </Control>
            <TextareaControl name="notes" label="Notes" />
            <PercentComplete size="sm" my={5} hasStripe isAnimated />
            <ButtonGroup spacing={4}>
              <Button
                isLoading={submitting}
                loadingText="Submitting"
                variantColor="teal"
                type="submit"
              >
                Submit
              </Button>
              <Button
                variantColor="teal"
                variant="outline"
                onClick={form.reset}
                isDisabled={submitting || pristine}
              >
                Reset
              </Button>
            </ButtonGroup>
            <Box as="pre" my={10}>
              {JSON.stringify(values, 0, 2)}
            </Box>
          </Box>
        )}
      />
    </Box>
  </ThemeProvider>
)

const AdaptedTextarea = ({ input, meta, ...rest }) => (
  <Textarea {...input} {...rest} isInvalid={meta.error && meta.touched} />
)

const CheckboxControl = ({ name, value, children }) => {
  const {
    input: { checked, ...input },
    meta: { error, touched, invalid }
  } = useField(name, {
    type: 'checkbox' // important for RFF to manage the checked prop
  })
  return (
    <FormControl isInvalid={touched && invalid} my={4}>
      <Checkbox {...input} isInvalid={touched && invalid} my={4}>
        {children}
      </Checkbox>
      <FormErrorMessage>{error}</FormErrorMessage>
    </FormControl>
  )
}

const CheckboxArrayControl = ({ name, value, children }) => {
  const {
    input: { checked, ...input },
    meta: { error, touched }
  } = useField(name, {
    type: 'checkbox', // important for RFF to manage the checked prop
    value // important for RFF to manage list of strings
  })
  return (
    <Checkbox {...input} isChecked={checked} isInvalid={error && touched}>
      {children}
    </Checkbox>
  )
}

const AdaptedRadioGroup = ({ input, meta, label, children }) => (
  <FormControl isInvalid={meta.touched && meta.invalid} my={4}>
    <FormLabel htmlFor={input.name}>{label}</FormLabel>
    <RadioGroup {...input}>{children}</RadioGroup>
    <FormErrorMessage>{meta.error}</FormErrorMessage>
  </FormControl>
)

const Control = ({ name, ...rest }) => {
  const {
    meta: { error, touched }
  } = useField(name, { subscription: { touched: true, error: true } })
  return <FormControl {...rest} isInvalid={error && touched} />
}

const Error = ({ name }) => {
  const {
    meta: { error }
  } = useField(name, { subscription: { error: true } })
  return <FormErrorMessage>{error}</FormErrorMessage>
}

const InputControl = ({ name, label }) => {
  const { input, meta } = useField(name)
  return (
    <Control name={name} my={4}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Input
        {...input}
        isInvalid={meta.error && meta.touched}
        id={name}
        placeholder={label}
      />
      <Error name={name} />
    </Control>
  )
}

const TextareaControl = ({ name, label }) => (
  <Control name={name} my={4}>
    <FormLabel htmlFor={name}>{label}</FormLabel>
    <Field
      name={name}
      component={AdaptedTextarea}
      placeholder={label}
      id={name}
    />
    <Error name={name} />
  </Control>
)

const PercentComplete = props => {
  const form = useForm()
  const numFields = form.getRegisteredFields().length
  const numErrors = Object.keys(form.getState().errors).length
  return (
    <Progress
      value={numFields === 0 ? 0 : ((numFields - numErrors) / numFields) * 100}
      {...props}
    />
  )
}

render(<App />, document.getElementById('root'))
