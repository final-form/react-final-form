import React from "react";
import { FormSpy } from "react-final-form";
import diff from "object-diff";

class AutoSave extends React.Component {
  static defaultProps = {
    debounced: []
  };
  constructor(props) {
    super(props);
    this.state = { values: props.values, submitting: false };
  }

  componentWillReceiveProps(nextProps) {
    const { values, debounce, debounced } = nextProps;
    const debouncedValues = {};
    const immediateValues = {};

    Object.keys(values).forEach(key => {
      if (~debounced.indexOf(key)) {
        debouncedValues[key] = values[key];
      } else {
        immediateValues[key] = values[key];
      }
    });
    if (Object.keys(immediateValues).length) {
      this.save(immediateValues);
    }
    if (Object.keys(debouncedValues).length) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.save(debouncedValues);
      }, debounce);
    }
  }

  save = async values => {
    if (this.promise) {
      await this.promise;
    }
    const { save } = this.props;

    const changedValues = Object.keys(values).reduce((result, key) => {
      if (values[key] !== this.state.values[key]) {
        result[key] = values[key];
      }
      return result;
    }, {});
    if (Object.keys(changedValues).length) {
      diff(this.state.values);
      // values have changed
      this.setState(state => ({
        submitting: true,
        values: { ...state.values, ...changedValues }
      }));
      this.promise = save(changedValues);
      await this.promise;
      delete this.promise;
      this.setState({ submitting: false });
    }
  };

  render() {
    // This component doesn't have to render anything, but it can render
    // submitting state.
    return (
      this.state.submitting && <div className="submitting">Submitting...</div>
    );
  }
}

// Make a HOC
// This is not the only way to accomplish auto-save, but it does let us:
// - Use built-in React lifecycle methods to listen for changes
// - Maintain state of when we are submitting
// - Render a message when submitting
// - Pass in debounce and save props nicely
export default props => (
  <FormSpy {...props} subscription={{ values: true }} component={AutoSave} />
);
