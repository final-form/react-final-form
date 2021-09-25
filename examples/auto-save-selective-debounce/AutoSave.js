import React from "react";
import { FormSpy } from "react-final-form";
import diff from "object-diff";

const areObjectsIdentical = (a, b) =>
  Object.keys(diff(a, b)).length === 0 && Object.keys(diff(b, a)).length === 0;

class AutoSave extends React.Component {
  static defaultProps = {
    debounced: [],
  };
  constructor(props) {
    super(props);

    this.state = {
      submitting: false,
      ...this.splitValues(props.values),
    };
  }

  componentDidUpdate() {
    const { values, debounce } = this.props;
    const { debouncedValues, immediateValues } = this.splitValues(values);

    if (!areObjectsIdentical(this.state.immediateValues, immediateValues)) {
      this.save();
    }

    if (!areObjectsIdentical(this.state.debouncedValues, debouncedValues)) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.save();
      }, debounce);
    }
  }

  splitValues = (values) => {
    const { debounced } = this.props;

    const debouncedValues = {};
    const immediateValues = {};

    Object.keys(values).forEach((key) => {
      if (debounced.includes(key)) {
        debouncedValues[key] = values[key];
      } else {
        immediateValues[key] = values[key];
      }
    });

    return {
      debouncedValues,
      immediateValues,
    };
  };

  save = async () => {
    if (this.promise) {
      await this.promise;
    }
    const { save, values } = this.props;

    const { debouncedValues, immediateValues } = this.splitValues(values);

    this.setState(
      (state) => ({
        submitting: true,
        immediateValues: { ...immediateValues },
        debouncedValues: { ...debouncedValues },
      }),
      async () => {
        this.promise = save({
          ...this.state.immediateValues,
          ...this.state.debouncedValues,
        });

        await this.promise;
        delete this.promise;

        this.setState({ submitting: false });
      },
    );
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
export default (props) => (
  <FormSpy {...props} subscription={{ values: true }} component={AutoSave} />
);
