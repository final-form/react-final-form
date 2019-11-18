# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/examples). Links may not work on Github.com.

# Examples

---

Wanna help? We need to migrate all of these examples from CodeSandbox to [here](https://github.com/final-form/react-final-form/tree/master/examples). PRs to help with that process would be greatly appreciated. 🙏

---

### [Simple Example](examples/simple)

Uses the built-in React inputs: `input`, `select`, and `textarea` to build a form with no validation.

### [Synchronous Record-Level Validation](examples/record-level-validation)

Introduces a whole-record validation function and demonstrates how to display errors next to fields using child render functions.

### [Synchronous Field-Level Validation](examples/field-level-validation)

Introduces field-level validation functions and demonstrates how to display errors next to fields using child render functions.

### [Synchronous Record-Level Validation (with delayed error render)](https://codesandbox.io/s/z2zqr008pm)

Sometimes you want to give your user a chance to make it through a brief invalid value on their way to a valid one, e.g. a date string that needs two numbers on either side of a slash. With a simple delayed rendering component, this becomes easy. Plus, the error will disappear immediately when the user fixes the problem.

### [Asynchronous Field-Level Validation](https://codesandbox.io/s/wy7z7q5zx5)

Demonstrates how field-level validation rules may be asynchronous (return a
`Promise`), as well as how to show a "validating" spinner during the lifetime of
the `Promise`.

### [Hybrid Synchronous/Asynchronous Record-Level Validation](https://codesandbox.io/s/kl9n295n5)

Demonstrates how you can mix synchronous and asynchronous validation patterns at
the record-level, by returning errors synchronously, and falling back to an
asynchronous call (by returning a `Promise`) if sync validation is passing.

### [Submission Errors](examples/submission-errors)

Demonstrates how to return submission errors from failed submits. Notice that the `Promise` should _resolve_ to the submission error (not reject). Rejection is reserved for communications or server exceptions.

### [Third Party Components](https://codesandbox.io/s/40mr0v2r87)

Demonstrates how easy it is to use third party input components. All the third
party component really needs is `value` and `onChange`, but more complex
components can accept things like errors.

### Material-UI

- [Wrapper components](https://github.com/Deadly0/final-form-material-ui) / [Codesandbox demo](https://codesandbox.io/s/9ywq085k9w)
- [Wrapper components](https://github.com/lookfirst/mui-rff) / [Codesandbox demo](https://codesandbox.io/s/react-final-form-material-ui-example-tqv09)

### 💥 [Performance Optimization Through Subscriptions](examples/subscriptions) 💥

Demonstrates how, by restricting which parts of form state the form component needs to render, it reduces the number of times the whole form has to rerender. Yet, if some part of form state is needed inside of it, the [`<FormSpy/>`](api/FormSpy) component can be used to attain it.

### [Strongly Typed Form and Field Values with TypeScript](https://codesandbox.io/s/strongly-typed-form-values-with-react-final-form-26jkd)

Demonstrates how to use JSX generics to strongly type fields, forcing only a component that can accept the type for that field.

### [Independent Error Component (with Render Props)](https://codesandbox.io/s/xoo3xq654p)

Demonstrates how to make an independent Error component to subscribe to and
display the error for any form field.

### [Independent Error Component (with Hooks)](https://codesandbox.io/s/react-final-form-independent-error-component-with-hooks-y1grn)

Demonstrates how to make an independent Error component, using Hooks, to subscribe to and
display the error for any form field.

### [Loading and Initializing Values](https://codesandbox.io/s/91w9ro3x9o)

Demonstrates how a form can be initialized, after fetching data, by passing in
`initialValues` as a prop.

### [Field Arrays](https://codesandbox.io/s/kx8qv67nk5)

Demostrates how to use the `<FieldArray/>` component, from
[`react-final-form-arrays`](https://github.com/final-form/react-final-form-arrays),
to render an array of inputs, as well as use `push`, `pop`, and `remove`
mutations.

### [Fields Component](https://codesandbox.io/s/pyrwplknom)

Wondering how to get field state from multiple fields at once?

People coming from Redux-Form might be wondering where the equivalent of Redux Form's `Fields` component is, as a way to get state from several fields at once. The answer is that it's not included in the library because it's so easy to write one recursively composing `Field` components together.

### [Calculated Fields](https://codesandbox.io/s/oq52p6v96y)

Demonstrates how to use the
[`final-form-calculate`](https://github.com/final-form/final-form-calculate)
decorator to achieve realtime field calculations through easily defined rules.

### [Field Warnings](https://codesandbox.io/s/m5qwxpr6o8)

Demonstrates how the power of subscriptions and mutators can be used to build a
warning engine: logic to display a message next to each field that is _not_ an
error (thus it does _not_ prevent form submission).

### [Reusable Field Groups](https://codesandbox.io/s/8z5jm6x80)

Demonstrates how fields can be grouped into reusable components.

### [Prefixed Fields](https://codesandbox.io/s/react-final-form-prefixed-fields-seiy8)

Demonstrates how the React context API can be used to provide a "prefix wrapper"
around fields to add structure to your form date. It's similar to how Redux Form's
[`FormSection`](https://redux-form.com/8.2.2/docs/api/formsection.md/) component works.
Between this and the [Reusable Field Groups](#reusable-field-groups) example, your
use case, if migrating from `FormSection` should be handled.

### [External Submit](https://codesandbox.io/s/1y7noyrlmq)

Demonstrates how you can use `document.getElementById()` or a closure to trigger
a submit from outside of the form. For more information, see
[How can I trigger a submit from outside the form?](docs/faq.md#how-can-i-trigger-a-submit-from-outside-my-form)

### [Wizard Form](examples/wizard)

Demonstrates how to use React Final Form to create a multi-page "wizard" form, with validation on each page.

### [Parse and Format (and Normalize)](https://codesandbox.io/s/10rzowm323)

Demonstrates how to use 🏁 React Final Form's `parse` and `format` props to control exactly how the data flows from the form state through the input and back to the form state. Notice that you can use `parse` to "normalize" your values.

### [Auto-Save with Debounce](https://codesandbox.io/s/5w4yrpyo7k)

Demonstrates how to use a `FormSpy` component to listen for value changes and automatically submit different values after a debounce period.

### [Auto-Save with Selective Debounce](https://codesandbox.io/s/98j0v46zj4)

Demonstrates how to use a `FormSpy` component to listen for value changes and automatically submit different values after a debounce period, but only does the debounce for certain specified fields, in this case, all the text fields.

### [Auto-Save on Field Blur](https://codesandbox.io/s/7k742qpo36)

Demonstrates how to use a `FormSpy` component to listen for values and active field changes to automatically submit values when fields are blurred.

### [Custom Validation Engine](https://codesandbox.io/s/kxxw4l0p9o)

Demonstrates how incredibly extensible `FormSpy`, the [`setFieldData` mutator](https://github.com/final-form/final-form-set-field-data), and render props are by implementing a custom validation engine completely apart from the built-in validation in 🏁 Final Form, thus allowing for special behaviors, like only validating a single field when that field is blurred.

### [Loading, Normalizing, Saving, and Reinitializing](https://codesandbox.io/s/xr0mvl1904)

Demonstrates how to make a wrapper component to handle loading, normalization of data, saving, and reinitializing of the form, to maintain `pristine`/`dirty` state with saved data.

### [🏎️ Downshift Type-Ahead](https://codesandbox.io/s/qzm43nn2mj)

Demonstrates how to use a [🏎️ Downshift](https://github.com/paypal/downshift) type-ahead component as an input.

### [Redux Example](https://codesandbox.io/s/4xq2qpzw79)

The only reason to keep your 🏁 Final Form form data in Redux is if you need to be able to read it from outside your form. This example demonstrates how to use a `FormSpy` to keep a copy of your form data in the Redux store. Note that the canonical authoritative version of the data still lives in 🏁 Final Form. If you need to _mutate_ your data via dispatching Redux actions, you should probably use [Redux Form](https://redux-form.com).

### [Conditional Fields](https://codesandbox.io/s/lm4p3m92q)

Sometimes you might want to conditionally show or hide some parts of your form depending on values the user has already provided for other form inputs. 🏁 React Final Form makes that very easy to do by creating a `Condition` component out of a `Field` component.

### [Listening for External Changes](https://codesandbox.io/s/3x989zl866)

By wrapping a stateful `ExternalModificationDetector` component in a `Field` component, we can listen for changes to a field's value, and by knowing whether or not the field is active, deduce when a field's value changes due to external influences.

### [Focus On First Error](https://codesandbox.io/s/6174kqr403)

Demonstrates how to incorporate the [🏁 Final Form Focus 🧐](https://github.com/final-form/final-form-focus) decorator to provide this functionality out of the box.

### [Credit Card Example](https://codesandbox.io/s/9y8vkrrx9o)

Demonstrates how to make an awesome credit card UX using [React Credit Cards](https://github.com/amarofashion/react-credit-cards).

### [Async Redux Submission](https://codesandbox.io/s/x71mx66z8w)

Want to use `redux-saga` or `redux-observable` to manage your form submissions? Now you can, using [`react-redux-promise-listener`](https://github.com/erikras/react-redux-promise-listener#react-redux-promise-listener) to convert your dispatched Redux actions into the `Promise` that 🏁 React Final Form is expecting for its `onSubmit` function.

### [Declarative Form Rules](https://codesandbox.io/s/52q597j2p)

What if you could define rules to update fields when other fields change _as components_? This example explores such possibilities. There's also [a Medium post](https://medium.com/@erikras/declarative-form-rules-c5949ea97366) about writing it, and creating a companion library, [`react-final-form-listeners`](https://github.com/final-form/react-final-form-listeners#-react-final-form-listeners).

### [Format String By Pattern](https://codesandbox.io/s/no20p7z3l)

Demonstrates how to use the library `format-string-by-pattern` to create input masks for your 🏁 React Final Form fields.

### [AsyncTypeahead and Redux](https://codesandbox.io/s/5m4w2909k)

Demonstrates creating an `AsyncTypeahead` to select github users, while storing the search results in the redux store and the form state (selected github users) via `react-final-form`. Also makes use of the [`setFieldData` mutator](https://github.com/final-form/final-form-set-field-data).

### [Format On Blur](https://codesandbox.io/s/3rp260ly51)

Demonstrates how to use the `formatOnBlur` prop to postpone the formatting of a form field value until the field loses focus. Very useful for formatting numbers, like currencies.

### [Styling with 🍭 Smooth-UI](https://codesandbox.io/s/40o45po3l4)

Demonstrates how to use the Smooth-UI styling library to make your forms look fabulous! All you really need is a higher order component that adapts The 🍭 Smooth-UI form controls to work with 🏁 React Final Form.

### [Styling with Chakra-UI](examples/chakra)

Demonstrates how to use the [Chakra UI](https://chakra-ui.com) styling library to make your forms look fabulous!

### [CLI Example](https://github.com/final-form/rff-cli-example) 🤯

Yes! You can actually use 🏁 React Final Form in a command line interface! Thanks to packages like [Ink](https://github.com/vadimdemedes/ink) and [Pastel](https://github.com/vadimdemedes/pastel), the power of 🏁 Final Form's form state management works just fine on the command line.
