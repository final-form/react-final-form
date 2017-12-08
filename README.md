# 🏁 React Final Form

![React Final Form](banner.png)

[![NPM Version](https://img.shields.io/npm/v/react-final-form.svg?style=flat)](https://www.npmjs.com/package/react-final-form)
[![NPM Downloads](https://img.shields.io/npm/dm/react-final-form.svg?style=flat)](https://www.npmjs.com/package/react-final-form)
[![Build Status](https://travis-ci.org/final-form/react-final-form.svg?branch=master)](https://travis-ci.org/final-form/react-final-form)
[![codecov.io](https://codecov.io/gh/final-form/react-final-form/branch/master/graph/badge.svg)](https://codecov.io/gh/final-form/react-final-form)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

✅ Zero dependencies

✅ Only peer dependencies: React and
[🏁 Final Form](https://github.com/final-form/final-form#-final-form)

✅ Opt-in subscriptions - only update on the state you need!

✅ 💥 **2.5k gzipped** 💥

---

## Installation

```bash
npm install --save react-final-form final-form
```

or

```bash
yarn add react-final-form final-form
```

## Getting Started

🏁 React Final Form is a thin React wrapper for 🏁 Final Form, which is a
subscriptions-based form state management library that uses the
[Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern), so only the
components that need updating are re-rendered as the form's state changes. By
default, 🏁 React Final Form subscribes to _all_ changes, but if you want to
fine tune your form to optimized blazing-fast perfection, you may specify only
the form state that you care about for rendering your gorgeous UI.

You can think of it a little like GraphQL's feature of only fetching the data
your component needs to render, and nothing else.

Here's what it looks like in your code:

```js
import { Form, Field } from 'react-final-form'

const MyForm = () => (
  <Form
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit, pristine, invalid }) => (
      <form onSubmit={handleSubmit}>
        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Field name="firstName" component="input" placeholder="First Name" />
        </div>

        <h2>An Arbitrary Reusable Input Component</h2>
        <div>
          <label>Interests</label>
          <Field name="interests" component={InterestPicker} />
        </div>

        <h2>Render Function</h2>
        <Field
          name="bio"
          render={({ input, meta }) => (
            <div>
              <label>Bio</label>
              <textarea {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />

        <h2>Render Function as Children</h2>
        <Field name="phone">
          {({ input, meta }) => (
            <div>
              <label>Phone</label>
              <input type="text" {...input} placeholder="Phone" />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        </Field>

        <button type="submit" disabled={pristine || invalid}>
          Submit
        </button>
      </form>
    )}
  />
)
```

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Examples](#examples)
  * [Simple Example](#simple-example)
  * [Synchronous Record-Level Validation](#synchronous-record-level-validation)
  * [Synchronous Field-Level Validation](#synchronous-field-level-validation)
  * [Asynchronous Field-Level Validation](#asynchronous-field-level-validation)
  * [Hybrid Synchronous/Asynchronous Record-Level Validation](#hybrid-synchronousasynchronous-record-level-validation)
  * [Submission Errors](#submission-errors)
  * [Third Party Components](#third-party-components)
  * [💥 Performance Optimization Through Subscriptions 💥](#-performance-optimization-through-subscriptions-)
  * [Independent Error Component](#independent-error-component)
  * [Loading and Initializing Values](#loading-and-initializing-values)
  * [Field Arrays](#field-arrays)
* [Rendering](#rendering)
* [API](#api)
  * [`Field : React.ComponentType<FieldProps>`](#field--reactcomponenttypefieldprops)
  * [`Form : React.ComponentType<FormProps>`](#form--reactcomponenttypeformprops)
  * [`FormSpy : React.ComponentType<FormSpyProps>`](#formspy--reactcomponenttypeformspyprops)
  * [`version: string`](#version-string)
* [Types](#types)
  * [`FieldProps`](#fieldprops)
    * [`allowNull?: boolean`](#allownull-boolean)
    * [`children?: ((props: FieldRenderProps) => React.Node) | React.Node`](#children-props-fieldrenderprops--reactnode--reactnode)
    * [`component?: React.ComponentType<FieldRenderProps>`](#component-reactcomponenttypefieldrenderprops)
    * [`name: string`](#name-string)
    * [`render?: (props: FieldRenderProps) => React.Node`](#render-props-fieldrenderprops--reactnode)
    * [`subscription?: FieldSubscription`](#subscription-fieldsubscription)
    * [`validate?: (value: ?any, allValues: Object) => ?any`](#validate-value-any-allvalues-object--any)
    * [`value?: any`](#value-any)
  * [`FieldRenderProps`](#fieldrenderprops)
    * [`input.name: string`](#inputname-string)
    * [`input.onBlur: (?SyntheticFocusEvent<*>) => void`](#inputonblur-syntheticfocusevent--void)
    * [`input.onChange: (SyntheticInputEvent<*> | any) => void`](#inputonchange-syntheticinputevent--any--void)
    * [`input.onFocus: (?SyntheticFocusEvent<*>) => void`](#inputonfocus-syntheticfocusevent--void)
    * [`input.value: any`](#inputvalue-any)
    * [`meta.active?: boolean`](#metaactive-boolean)
    * [`meta.data: Object`](#metadata-object)
    * [`meta.dirty?: boolean`](#metadirty-boolean)
    * [`meta.error?: any`](#metaerror-any)
    * [`meta.initial?: any`](#metainitial-any)
    * [`meta.invalid?: boolean`](#metainvalid-boolean)
    * [`meta.pristine?: boolean`](#metapristine-boolean)
    * [`meta.submitError?: any`](#metasubmiterror-any)
    * [`meta.submitFailed?: boolean`](#metasubmitfailed-boolean)
    * [`meta.submitSucceeded?: boolean`](#metasubmitsucceeded-boolean)
    * [`meta.touched?: boolean`](#metatouched-boolean)
    * [`meta.valid?: boolean`](#metavalid-boolean)
    * [`meta.visited?: boolean`](#metavisited-boolean)
  * [`FormProps`](#formprops)
    * [`children?: ((props: FormRenderProps) => React.Node) | React.Node`](#children-props-formrenderprops--reactnode--reactnode)
    * [`component?: React.ComponentType<FormRenderProps>`](#component-reactcomponenttypeformrenderprops)
    * [`debug?: DebugFunction`](#debug-debugfunction)
    * [`decorators?: Decorator[]`](#decorators-decorator)
    * [`initialValues?: Object`](#initialvalues-object)
    * [`mutators?: { [string]: Mutator }`](#mutators--string-mutator-)
    * [`onSubmit: (values: Object, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object> | void`](#onsubmit-values-object-callback-errors-object--void--object--promiseobject--void)
    * [`render?: (props: FormRenderProps) => React.Node`](#render-props-formrenderprops--reactnode)
    * [`subscription?: FormSubscription`](#subscription-formsubscription)
    * [`validate?: (values: Object) => Object | Promise<Object>`](#validate-values-object--object--promiseobject)
    * [`validateOnBlur?: boolean`](#validateonblur-boolean)
  * [`FormRenderProps`](#formrenderprops)
    * [`batch: (fn: () => void) => void)`](#batch-fn---void--void)
    * [`blur: (name: string) => void`](#blur-name-string--void)
    * [`change: (name: string, value: any) => void`](#change-name-string-value-any--void)
    * [`focus: (name: string) => void`](#focus-name-string--void)
    * [`handleSubmit: (SyntheticEvent<HTMLFormElement>) => void`](#handlesubmit-syntheticeventhtmlformelement--void)
    * [`initialize: (values: Object) => void`](#initialize-values-object--void)
    * [`mutators?: { [string]: Function }`](#mutators--string-function-)
    * [`reset: () => void`](#reset---void)
  * [`FormSpyProps`](#formspyprops)
    * [`children?: ((props: FormSpyRenderProps) => React.Node) | React.Node`](#children-props-formspyrenderprops--reactnode--reactnode)
    * [`component?: React.ComponentType<FormSpyRenderProps>`](#component-reactcomponenttypeformspyrenderprops)
    * [`onChange?: (formState: FormState) => void`](#onchange-formstate-formstate--void)
    * [`render?: (props: FormSpyRenderProps) => React.Node`](#render-props-formspyrenderprops--reactnode)
    * [`subscription?: FormSubscription`](#subscription-formsubscription-1)
  * [`FormSpyRenderProps`](#formspyrenderprops)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Examples

### [Simple Example](https://codesandbox.io/s/ww40y2m595)

Uses the built-in React inputs: `input`, `select`, and `textarea` to build a
form with no validation.

### [Synchronous Record-Level Validation](https://codesandbox.io/s/yk1zx56y5j)

Introduces a whole-record validation function and demonstrates how to display
errors next to fields using child render functions.

### [Synchronous Field-Level Validation](https://codesandbox.io/s/2k054qp40)

Introduces field-level validation functions and demonstrates how to display
errors next to fields using child render functions.

### [Asynchronous Field-Level Validation](https://codesandbox.io/s/wy7z7q5zx5)

Demonstrates how field-level validation rules may be asynchronous (return a
`Promise`), as well as how to show a "validating" spinner during the lifetime of
the `Promise`.

### [Hybrid Synchronous/Asynchronous Record-Level Validation](https://codesandbox.io/s/kl9n295n5)

Demonstrates how you can mix synchronous and asynchronous validation patterns at
the record-level, by returning errors synchronously, and falling back to an
asynchronous call (by returning a `Promise`) if sync validation is passing.

### [Submission Errors](https://codesandbox.io/s/9y9om95lyp)

Demonstrates how to return submission errors from failed submits. Notice that
the `Promise` should _resolve_ to the submission error (not reject). Rejection
is reserved for communications or server exceptions.

### [Third Party Components](https://codesandbox.io/s/40mr0v2r87)

Demonstrates how easy it is to use third party input components. All the third
party component really needs is `value` and `onChange`, but more complex
components can accept things like errors.

### 💥 [Performance Optimization Through Subscriptions](https://codesandbox.io/s/32r824vxy1) 💥

Demonstrates how, by restricting which parts of form state the form component
needs to render, it reduce the number of times the whole form has to rerender.
Yet, if some part of form state is needed inside of it, the
[`FormSpy`](#formspy--reactcomponenttypeformspyprops) component can be used to
attain it.

### [Independent Error Component](https://codesandbox.io/s/xoo3xq654p)

Demonstrates how to make an independent Error component to subscribe to and
display the error for any form field.

### [Loading and Initializing Values](https://codesandbox.io/s/91w9ro3x9o)

Demonstrates how a form can be initialized, after fetching data, by passing in
`initialValues` as a prop.

### [Field Arrays](https://codesandbox.io/s/kx8qv67nk5)

Demostrates how to use the `<FieldArray/>` component, from
[`react-final-form-arrays`](https://github.com/final-form/react-final-form-arrays),
to render an array of inputs, as well as use `push`, `pop`, and `remove`
mutations.

## Rendering

There are three ways to tell `<Form/>` and `<Field/>` what to render:

| Method                          | How it is rendered                                        |
| ------------------------------- | --------------------------------------------------------- |
| `component` prop                | `return React.createElement(this.props.component, props)` |
| `render` prop                   | `return this.props.render(props)`                         |
| a render function as `children` | `return this.props.children(props)`                       |

## API

The following can be imported from `react-final-form`.

### `Field : React.ComponentType<FieldProps>`

A component that takes [`FieldProps`](#fieldprops) and renders an individual
field.

### `Form : React.ComponentType<FormProps>`

A component that takes [`FormProps`](#formprops) and surrounds your entire form.

### `FormSpy : React.ComponentType<FormSpyProps>`

A component that takes [`FormSpyProps`](#formspyprops) and can listen to form
state from inside an optimized `<Form/>`.

### `version: string`

The current used version of 🏁 React Final Form.

---

## Types

### `FieldProps`

These are props that you pass to
[`<Field/>`](#field--reactcomponenttypefieldprops). You must provide one of the
ways to render: `component`, `render`, or `children`.

#### `allowNull?: boolean`

By default, if your value is `null`, `<Field/>` will convert it to `''`, to
ensure
[controlled inputs](https://reactjs.org/docs/forms.html#controlled-components).
But if you pass `true` to `allowNull`, `<Field/>` will give you a `null` value.
Defaults to `false`.

#### `children?: ((props: FieldRenderProps) => React.Node) | React.Node`

A render function that is given [`FieldRenderProps`](#fieldrenderprops), as well
as any non-API props passed into the `<Field/>` component.

#### `component?: React.ComponentType<FieldRenderProps>`

A component that is given [`FieldRenderProps`](#fieldrenderprops) as props, as
well as any non-API props passed into the `<Field/>` component.

#### `name: string`

The name of your field.

#### `render?: (props: FieldRenderProps) => React.Node`

A render function that is given [`FieldRenderProps`](#fieldrenderprops), as well
as any non-API props passed into the `<Field/>` component.

#### `subscription?: FieldSubscription`

A
[`FieldSubscription`](https://github.com/final-form/final-form#fieldsubscription--string-boolean-)
that selects of all the items of
[`FieldState`](https://github.com/final-form/final-form#fieldstate) that you
wish to update for. If you don't pass a `subscription` prop, it defaults to
_all_ of [`FieldState`](https://github.com/final-form/final-form#fieldstate).

#### `validate?: (value: ?any, allValues: Object) => ?any`

A function that takes the field value, and all the values of the form and
returns an error if the value is invalid, or `undefined` if the value is valid.

#### `value?: any`

**This is only used for radio buttons!** The value of the radio button. The
radio button will render as `checked` if and only if the value given here `===`
the value for the field in the form.

### `FieldRenderProps`

These are the props that [`<Field/>`](#field--reactcomponenttypefieldprops)
provides to your render function or component. This object separates out the
values and event handlers intended to be given to the input component from the
`meta` data about the field. The `input` can be destructured directly into an
`<input/>` like so: `<input {...props.input}/>`. Keep in mind that **the values
in `meta` are dependent on you having subscribed to them** with the
[`subscription` prop](#subscription-fieldsubscription)

#### `input.name: string`

The name of the field.

#### `input.onBlur: (?SyntheticFocusEvent<*>) => void`

The `onBlur` function can take a `SyntheticFocusEvent` like it would if you had
given it directly to an `<input/>` component, but you can also just call it:
`props.input.onBlur()` to mark the field as blurred (inactive).

#### `input.onChange: (SyntheticInputEvent<*> | any) => void`

The `onChange` function can take a `SyntheticInputEvent` like it would if you
had given it directly to an `<input/>` component (in which case it will read the
value out of `event.target.value`), but you can also just call it:
`props.input.onChange(value)` to update the value of the field.

#### `input.onFocus: (?SyntheticFocusEvent<*>) => void`

The `onFocus` function can take a `SyntheticFocusEvent` like it would if you had
given it directly to an `<input/>` component, but you can also just call it:
`props.input.onFocus()` to mark the field as focused (active).

#### `input.value: any`

The current value of the field.

#### `meta.active?: boolean`

[See the 🏁 Final Form docs on `active`](https://github.com/final-form/final-form#active-boolean).

#### `meta.data: Object`

[See the 🏁 Final Form docs on `data`](https://github.com/final-form/final-form#data-object).

#### `meta.dirty?: boolean`

[See the 🏁 Final Form docs on `dirty`](https://github.com/final-form/final-form#dirty-boolean).

#### `meta.error?: any`

[See the 🏁 Final Form docs on `error`](https://github.com/final-form/final-form#error-any).

#### `meta.initial?: any`

[See the 🏁 Final Form docs on `initial`](https://github.com/final-form/final-form#initial-any).

#### `meta.invalid?: boolean`

[See the 🏁 Final Form docs on `invalid`](https://github.com/final-form/final-form#invalid-boolean).

#### `meta.pristine?: boolean`

[See the 🏁 Final Form docs on `pristine`](https://github.com/final-form/final-form#pristine-boolean).

#### `meta.submitError?: any`

[See the 🏁 Final Form docs on `submitError`](https://github.com/final-form/final-form#submiterror-any).

#### `meta.submitFailed?: boolean`

[See the 🏁 Final Form docs on `submitFailed`](https://github.com/final-form/final-form#submitfailed-boolean).

#### `meta.submitSucceeded?: boolean`

[See the 🏁 Final Form docs on `submitSucceeded`](https://github.com/final-form/final-form#submitsucceeded-boolean).

#### `meta.touched?: boolean`

[See the 🏁 Final Form docs on `touched`](https://github.com/final-form/final-form#touched-boolean).

#### `meta.valid?: boolean`

[See the 🏁 Final Form docs on `valid`](https://github.com/final-form/final-form#valid-boolean).

#### `meta.visited?: boolean`

[See the 🏁 Final Form docs on `visited`](https://github.com/final-form/final-form#visited-boolean).

### `FormProps`

These are the props that you pass to
[`<Form/>`](#form--reactcomponenttypeformprops). You must provide one of the
ways to render: `component`, `render`, or `children`.

#### `children?: ((props: FormRenderProps) => React.Node) | React.Node`

A render function that is given [`FormRenderProps`](#formrenderprops), as well
as any non-API props passed into the `<Form/>` component.

#### `component?: React.ComponentType<FormRenderProps>`

A component that is given [`FormRenderProps`](#formrenderprops) as props, as
well as any non-API props passed into the `<Form/>` component.

#### `debug?: DebugFunction`

[See the 🏁 Final Form docs on `debug`](https://github.com/final-form/final-form#debug-debugfunction).

#### `decorators?: Decorator[]`

[`Decorator`](https://github.com/final-form/final-form#decorator-form-formapi--unsubscribe)s
to apply to the form.

#### `initialValues?: Object`

[See the 🏁 Final Form docs on `initialValues`](https://github.com/final-form/final-form#initialvalues-object).

#### `mutators?: { [string]: Mutator }`

[See the 🏁 Final Form docs on `mutators`](https://github.com/final-form/final-form#mutators--string-function-).

#### `onSubmit: (values: Object, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object> | void`

[See the 🏁 Final Form docs on `onSubmit`](https://github.com/final-form/final-form#onsubmit-values-object-callback-errors-object--void--object--promiseobject--void).

#### `render?: (props: FormRenderProps) => React.Node`

A render function that is given [`FormRenderProps`](#formrenderprops), as well
as any non-API props passed into the `<Form/>` component.

#### `subscription?: FormSubscription`

A
[`FormSubscription`](https://github.com/final-form/final-form#formsubscription--string-boolean-)
that selects of all the items of
[`FormState`](https://github.com/final-form/final-form#formstate) that you wish
to update for. If you don't pass a `subscription` prop, it defaults to _all_ of
[`FormState`](https://github.com/final-form/final-form#formstate).

#### `validate?: (values: Object) => Object | Promise<Object>`

[See the 🏁 Final Form docs on `validate`](https://github.com/final-form/final-form#validate-values-object--object--promiseobject).

#### `validateOnBlur?: boolean`

[See the 🏁 Final Form docs on `validateOnBlur`](https://github.com/final-form/final-form#validateonblur-boolean).

### `FormRenderProps`

These are the props that [`<Form/>`](#form--reactcomponenttypeformprops)
provides to your render function or component. Keep in mind that the values you
receive here are dependent upon which values of
[`FormState`](https://github.com/final-form/final-form#formstate) you have
subscribed to with the
[`subscription` prop](https://github.com/final-form/react-final-form#subscription-formsubscription).
This object contains everything in
[🏁 Final Form's `FormState`](https://github.com/final-form/final-form#formstate)
as well as:

#### `batch: (fn: () => void) => void)`

A function that allows batch updates to be done to the form state.
[See the 🏁 Final Form docs on `batch`](https://github.com/final-form/final-form#batch-fn---void--void).

#### `blur: (name: string) => void`

A function to blur (mark inactive) any field.

#### `change: (name: string, value: any) => void`

A function to change the value of any field.

#### `focus: (name: string) => void`

A function to focus (mark active) any field.

#### `handleSubmit: (SyntheticEvent<HTMLFormElement>) => void`

A function intended for you to give directly to the `<form>` tag: `<form
onSubmit={handleSubmit}/>`.

#### `initialize: (values: Object) => void`

A function that initializes the form values.
[See the 🏁 Final Form docs on `initialize`](https://github.com/final-form/final-form#initialize-values-object--void).

#### `mutators?: { [string]: Function }`

[See the 🏁 Final Form docs on `mutators`](https://github.com/final-form/final-form#mutators--string-function-).

#### `reset: () => void`

A function that resets the form values to their last initialized values.
[See the 🏁 Final Form docs on `reset`](https://github.com/final-form/final-form#reset---void).

### `FormSpyProps`

These are the props that you pass to
[`<FormSpy/>`](#formspy--reactcomponenttypeformspyprops). You must provide one
of the ways to render: `component`, `render`, or `children`.

#### `children?: ((props: FormSpyRenderProps) => React.Node) | React.Node`

A render function that is given [`FormSpyRenderProps`](#formspyrenderprops), as
well as any non-API props passed into the `<FormSpy/>` component. Will not be
called if an `onChange` prop is provided.

#### `component?: React.ComponentType<FormSpyRenderProps>`

A component that is given [`FormSpyRenderProps`](#formspyrenderprops) as props,
as well as any non-API props passed into the `<FormSpy/>` component. Will not be
called if an `onChange` prop is provided.

#### `onChange?: (formState: FormState) => void`

A change listener that will be called with form state whenever the form state,
as subscribed to by the `subscription` prop, has changed. When an `onChange`
prop is provided, the `<FormSpy/>` will not render anything.

#### `render?: (props: FormSpyRenderProps) => React.Node`

A render function that is given [`FormSpyRenderProps`](#formspyrenderprops), as
well as any non-API props passed into the `<FormSpy/>` component. Will not be
called if an `onChange` prop is provided.

#### `subscription?: FormSubscription`

A
[`FormSubscription`](https://github.com/final-form/final-form#formsubscription--string-boolean-)
that selects of all the items of
[`FormState`](https://github.com/final-form/final-form#formstate) that you wish
to update for. If you don't pass a `subscription` prop, it defaults to _all_ of
[`FormState`](https://github.com/final-form/final-form#formstate).

### `FormSpyRenderProps`

These are the props that
[`<FormSpy/>`](#formspy--reactcomponenttypeformspyprops) provides to your render
function or component. These props are of type
[`FormState`](https://github.com/final-form/final-form#formstate). Keep in mind
that the values you receive here are dependent upon which values of
[`FormState`](https://github.com/final-form/final-form#formstate) you have
subscribed to with the
[`subscription` prop](https://github.com/final-form/react-final-form#subscription-formsubscription).
