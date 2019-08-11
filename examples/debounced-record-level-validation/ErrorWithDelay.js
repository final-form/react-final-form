import React from 'react'
import { Field } from 'react-final-form'

const DisplayError = ({ delay, active, dirty, error, touched, children }) => {
  const [show, setShow] = React.useState(false)
  React.useEffect(
    () => {
      let timeout
      if (active && error && dirty) {
        console.info('setting timeout')
        timeout = setTimeout(() => setShow(true), delay)
      }
      return () => {
        console.info('clearing timeout')
        clearTimeout(timeout)
      }
    },
    [delay, error, active, dirty]
  )

  return error && ((touched && !active) || (touched && !show && active) || show)
    ? children(error)
    : null
}

const ErrorWithDelay = ({ name, children, delay }) => (
  <Field
    name={name}
    subscription={{ active: true, error: true, dirty: true, touched: true }}
  >
    {({ meta: { active, dirty, error, touched } }) => (
      <DisplayError
        delay={delay}
        active={active}
        dirty={dirty}
        error={error}
        touched={touched}
        children={children}
      />
    )}
  </Field>
)

export default ErrorWithDelay
