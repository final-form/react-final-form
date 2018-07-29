import React from 'react'
import { getIn } from 'final-form'
import { FormSpy } from 'react-final-form'

class OnBlurValidation extends React.Component {
  state = {
    withError: {},
    validating: false
  }

  componentWillReceiveProps(nextProps) {
    const field = this.props.active
    if (field && field !== nextProps.active) {
      // blur occurred
      const { rules, mutators, values } = nextProps
      const rule = rules[field]
      if (rule) {
        const value = getIn(values, field)
        let isSync = false
        const setError = error => {
          mutators.setFieldData(field, { error, validating: false })
          isSync = true
          this.setState(state => ({
            withError: {
              ...state.withError,
              [field]: !!error
            },
            validating: false
          }))
        }
        rule(value, setError)
        if (!isSync) {
          mutators.setFieldData(field, { validating: true })
          this.setState({
            validating: true
          })
        }
      }
    }
  }

  render() {
    const { withError, validating } = this.state
    const hasErrors = Object.keys(withError).some(key => withError[key])
    return this.props.render({ hasErrors, validating })
  }
}

// Make a HOC
export default props => (
  <FormSpy
    {...props}
    subscription={{ active: true, values: true }}
    component={OnBlurValidation}
  />
)
