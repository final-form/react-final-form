import React from "react";
import { Field } from "react-final-form";

/**
 * Listens for changes to a field's value, and, if the value changes
 * when the field is NOT active, it sets an externallyModified flag
 * which is passed to the children render function.
 */
class ExternalModificationDetector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      externallyModified: false,
      value: props.input.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    const {
      input: { value },
      meta: { active },
    } = nextProps;
    if (value !== this.state.value) {
      this.setState({
        value,
        externallyModified: !active,
      });
    } else if (this.state.externallyModified) {
      this.setState({
        externallyModified: false,
      });
    }
  }

  render() {
    const { children } = this.props;
    const { externallyModified } = this.state;
    return children(externallyModified);
  }
}

// Wrap the ExternalModificationDetector in a Field
export default ({ name, children }) => (
  <Field
    name={name}
    subscription={{ value: true, active: true }}
    render={(props) => (
      <ExternalModificationDetector {...props}>
        {children}
      </ExternalModificationDetector>
    )}
  />
);
