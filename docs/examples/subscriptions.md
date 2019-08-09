# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/examples/subscriptions). Links may not work on Github.com.

# High Performance Through Subscriptions Example

Demonstrates how, by restricting which parts of form state the form component needs to render, it reduces the number of times the whole form has to rerender. Yet, if some part of form state is needed inside of it, the [`<FormSpy/>`](../api/FormSpy) component can be used to attain it.

[![Edit react-final-form-subscriptions-example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/final-form/react-final-form/tree/master/examples/subscriptions)
