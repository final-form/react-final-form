const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (values.employed) {
    errors.employed = "We're only accepted unemployed applicants at the moment"
  }
  if (!values.favoriteColor) {
    errors.favoriteColor = 'Required'
  } else if (values.favoriteColor === '#00ff00') {
    errors.favoriteColor = 'Not green! Gross!'
  }
  if (!values.toppings || values.toppings.length < 2) {
    errors.toppings = 'You need at least two toppings'
  } else if (values.toppings && values.toppings.length > 3) {
    errors.toppings = 'No more than three toppings'
  }
  if (!values.notes) {
    errors.notes = 'Required'
  }
  return errors
}
export default validate
