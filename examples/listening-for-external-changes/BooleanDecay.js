import React from "react";
import PropTypes from "prop-types";

/**
 * 👋 Hey! Thanks for being curious about what this component does!
 * It's pretty simple. Have you ever seen those boxes where, when you
 * flip the switch, it activates a motor that causes a little hand to
 * come out and flip the switch back off? THAT'S what this component does.
 *
 * Examples: https://giphy.com/search/useless-box
 *
 * The value prop will be flipped back to false after the delay.
 */
export default class BooleanDecay extends React.Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
    delay: PropTypes.number.isRequired,
    value: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  startTimer() {
    this.stopTimer();
    this.timeout = setTimeout(() => {
      this.setState({ value: false });
    }, this.props.delay);
  }

  stopTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  componentDidMount() {
    if (this.state.value) {
      this.startTimer();
    }
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (value !== this.state.value) {
      this.setState({ value });
      if (value) {
        this.startTimer();
      } else {
        this.stopTimer();
      }
    }
  }

  render() {
    return this.props.children(this.state.value);
  }
}
