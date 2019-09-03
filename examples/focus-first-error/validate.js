export default values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (!values.street) {
    errors.street = 'Required'
  }
  if (!values.age) {
    errors.age = 'Required'
  } else if (isNaN(values.age)) {
    errors.age = 'Must be a number'
  }
  return errors
}
