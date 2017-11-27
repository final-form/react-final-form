# 🏁 React Final Form

![React Final Form](banner.png)

✅ Zero dependencies

✅ Only peer dependencies: React and
[🏁 Final Form](https://github.com/erikras/final-form#-final-form)

✅ Opt-in subscriptions - only update on the state you need!

✅ 💥 **2.09k gzipped** 💥

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

const MyForm = () =>
  <Form
    onSubmit={onSubmit}
    validate={validate}
    render={({ handleSubmit, pristine, invalid }) =>
      <form onSubmit={handleSubmit}>

        <h2>Simple Default Input</h2>
        <div>
          <label>First Name</label>
          <Field name="firstName" component="input" placeholder="First Name"/>
        </div>

        <h2>An Arbitrary Reusable Input Component</h2>
        <div>
          <label>Interests</label>
          <Field name="interests" component={InterestPicker}/>
        </div>

        <h2>Render Function</h2>
        <Field name="bio" render={({ input, meta }) =>
          <div>
            <label>Bio</label>
            <textarea {...input}/>
            {meta.touched && meta.error && <span>{meta.error}</span>}
          </div>
        }>

        <h2>Render Function as Children</h2>
        <Field name="phone">
          {({ input, meta }) =>
            <div>
              <label>Phone</label>
              <input type="text" {...input} placeholder="Phone"/>
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          }
        </Field>

        <button type="submit" disabled={pristine || invalid}>Submit</button>
      </form>
    }
  />
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
* [Rendering](#rendering)
* [API](#api)
  * [`Form : React.ComponentType<FormProps>`](#form--reactcomponenttypeformprops)
  * [`Field : React.ComponentType<FieldProps>`](#field--reactcomponenttypefieldprops)
  * [`FormSpy : React.ComponentType<FormSpyProps>`](#formspy--reactcomponenttypeformspyprops)
* [Types](#types)
  * [`FieldProps`](#fieldprops)
    * [`allowNull?: boolean`](#allownull-boolean)
    * [`children?: (props: FieldRenderProps) => React.Node`](#children-props-fieldrenderprops--reactnode)
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
    * [`children?: (props: FormRenderProps) => React.Node`](#children-props-formrenderprops--reactnode)
    * [`component?: React.ComponentType<FormRenderProps>`](#component-reactcomponenttypeformrenderprops)
    * [`debug?: (state: FormState, fieldStates: { [string]: FieldState }) => void`](#debug-state-formstate-fieldstates--string-fieldstate---void)
    * [`initialValues?: Object`](#initialvalues-object)
    * [`onSubmit: (values: Object, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object>`](#onsubmit-values-object-callback-errors-object--void--object--promiseobject)
    * [`render?: (props: FormRenderProps) => React.Node`](#render-props-formrenderprops--reactnode)
    * [`subscription?: FormSubscription`](#subscription-formsubscription)
    * [`validate?: (values: Object) => void) => Object | Promise<Object>`](#validate-values-object--void--object--promiseobject)
    * [`validateOnBlur?: boolean`](#validateonblur-boolean)
  * [`FormRenderProps`](#formrenderprops)
    * [`batch: (() => void) => void`](#batch---void--void)
    * [`blur: (name: string) => void`](#blur-name-string--void)
    * [`change: (name: string, value: any) => void`](#change-name-string-value-any--void)
    * [`focus: (name: string) => void`](#focus-name-string--void)
    * [`handleSubmit: (SyntheticEvent<HTMLFormElement>) => void`](#handlesubmit-syntheticeventhtmlformelement--void)
  * [`FormSpyProps`](#formspyprops)
    * [`children?: (props: FormSpyRenderProps) => React.Node`](#children-props-formspyrenderprops--reactnode)
    * [`component?: React.ComponentType<FormSpyRenderProps>`](#component-reactcomponenttypeformspyrenderprops)
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

### [Asynchronous Field-Level Validation](https://codesandbox.io/s/2k054qp40)

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

## Rendering

There are three ways to tell `<Form/>` and `<Field/>` what to render:

| Method                          | How it is rendered                                        |
| ------------------------------- | --------------------------------------------------------- |
| `component` prop                | `return React.createElement(this.props.component, props)` |
| `render` prop                   | `return this.props.render(props)`                         |
| a render function as `children` | `return this.props.children(props)`                       |

## API

The following can be imported from `final-form`.

### `Form : React.ComponentType<FormProps>`

A component that takes [`FormProps`](#formprops) and surrounds your entire form.

### `Field : React.ComponentType<FieldProps>`

A component that takes [`FieldProps`](#fieldprops) and renders an individual
field.

### `FormSpy : React.ComponentType<FormSpyProps>`

A component that takes [`FormSpyProps`](#formspyprops) and can listen to form
state from inside an optimized `<Form/>`.

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

#### `children?: (props: FieldRenderProps) => React.Node`

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
[`FieldSubscription`](https://github.com/erikras/final-form#fieldsubscription--string-boolean-)
that selects of all the items of
[`FieldState`](https://github.com/erikras/final-form#fieldstate) that you wish
to update for. If you don't pass a `subscription` prop, it defaults to _all_ of
[`FieldState`](https://github.com/erikras/final-form#fieldstate).

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

[See the 🏁 Final Form docs on `active`](https://github.com/erikras/final-form#active-boolean).

#### `meta.dirty?: boolean`

[See the 🏁 Final Form docs on `dirty`](https://github.com/erikras/final-form#dirty-boolean).

#### `meta.error?: any`

[See the 🏁 Final Form docs on `error`](https://github.com/erikras/final-form#error-any).

#### `meta.initial?: any`

[See the 🏁 Final Form docs on `initial`](https://github.com/erikras/final-form#initial-any).

#### `meta.invalid?: boolean`

[See the 🏁 Final Form docs on `invalid`](https://github.com/erikras/final-form#invalid-boolean).

#### `meta.pristine?: boolean`

[See the 🏁 Final Form docs on `pristine`](https://github.com/erikras/final-form#pristine-boolean).

#### `meta.submitError?: any`

[See the 🏁 Final Form docs on `submitError`](https://github.com/erikras/final-form#submiterror-any).

#### `meta.submitFailed?: boolean`

[See the 🏁 Final Form docs on `submitFailed`](https://github.com/erikras/final-form#submitfailed-boolean).

#### `meta.submitSucceeded?: boolean`

[See the 🏁 Final Form docs on `submitSucceeded`](https://github.com/erikras/final-form#submitsucceeded-boolean).

#### `meta.touched?: boolean`

[See the 🏁 Final Form docs on `touched`](https://github.com/erikras/final-form#touched-boolean).

#### `meta.valid?: boolean`

[See the 🏁 Final Form docs on `valid`](https://github.com/erikras/final-form#valid-boolean).

#### `meta.visited?: boolean`

[See the 🏁 Final Form docs on `visited`](https://github.com/erikras/final-form#visited-boolean).

### `FormProps`

These are the props that you pass to
[`<Form/>`](#form--reactcomponenttypeformprops). You must provide one of the
ways to render: `component`, `render`, or `children`.

#### `children?: (props: FormRenderProps) => React.Node`

A render function that is given [`FormRenderProps`](#formrenderprops), as well
as any non-API props passed into the `<Form/>` component.

#### `component?: React.ComponentType<FormRenderProps>`

A component that is given [`FormRenderProps`](#formrenderprops) as props, as
well as any non-API props passed into the `<Form/>` component.

#### `debug?: (state: FormState, fieldStates: { [string]: FieldState }) => void`

[See the 🏁 Final Form docs on `debug`](https://github.com/erikras/final-form#debug-state-formstate-fieldstates--string-fieldstate---void).

#### `initialValues?: Object`

[See the 🏁 Final Form docs on `initialValues`](https://github.com/erikras/final-form#initialvalues-object).

#### `onSubmit: (values: Object, callback: ?(errors: ?Object) => void) => ?Object | Promise<?Object>`

[See the 🏁 Final Form docs on `onSubmit`](https://github.com/erikras/final-form#onsubmit-values-object-callback-errors-object--void--object--promiseobject).

#### `render?: (props: FormRenderProps) => React.Node`

A render function that is given [`FormRenderProps`](#formrenderprops), as well
as any non-API props passed into the `<Form/>` component.

#### `subscription?: FormSubscription`

A
[`FormSubscription`](https://github.com/erikras/final-form#formsubscription--string-boolean-)
that selects of all the items of
[`FormState`](https://github.com/erikras/final-form#formstate) that you wish to
update for. If you don't pass a `subscription` prop, it defaults to _all_ of
[`FormState`](https://github.com/erikras/final-form#formstate).

#### `validate?: (values: Object) => void) => Object | Promise<Object>`

[See the 🏁 Final Form docs on `validate`](https://github.com/erikras/final-form#validate-values-object--void--object--promiseobject).

#### `validateOnBlur?: boolean`

[See the 🏁 Final Form docs on `validateOnBlur`](https://github.com/erikras/final-form#validateonblur-boolean).

### `FormRenderProps`

These are the props that [`<Form/>`](#form--reactcomponenttypeformprops)
provides to your render function or component. Keep in mind that the values you
receive here are dependent upon which values of
[`FormState`](https://github.com/erikras/final-form#formstate) you have
subscribed to with the
[`subscription` prop](https://github.com/erikras/react-final-form#subscription-formsubscription).
This object contains everything in
[🏁 Final Form's `FormState`](https://github.com/erikras/final-form#formstate)
as well as:

#### `batch: (() => void) => void`

A function that allows batch updates to be done to the form state.
[See the 🏁 Final Form docs on `batch`](https://github.com/erikras/final-form#batch-fn---void--void).

#### `blur: (name: string) => void`

A function to blur (mark inactive) any field.

#### `change: (name: string, value: any) => void`

A function to change the value of any field.

#### `focus: (name: string) => void`

A function to focus (mark active) any field.

#### `handleSubmit: (SyntheticEvent<HTMLFormElement>) => void`

A function intended for you to give directly to the `<form>` tag: `<form
onSubmit={handleSubmit}/>`.

### `FormSpyProps`

These are the props that you pass to
[`<FormSpy/>`](#formspy--reactcomponenttypeformspyprops). You must provide one
of the ways to render: `component`, `render`, or `children`.

#### `children?: (props: FormSpyRenderProps) => React.Node`

A render function that is given [`FormSpyRenderProps`](#formspyrenderprops), as
well as any non-API props passed into the `<FormSpy/>` component.

#### `component?: React.ComponentType<FormSpyRenderProps>`

A component that is given [`FormSpyRenderProps`](#formspyrenderprops) as props,
as well as any non-API props passed into the `<FormSpy/>` component.

#### `render?: (props: FormSpyRenderProps) => React.Node`

A render function that is given [`FormSpyRenderProps`](#formspyrenderprops), as
well as any non-API props passed into the `<FormSpy/>` component.

#### `subscription?: FormSubscription`

A
[`FormSubscription`](https://github.com/erikras/final-form#formsubscription--string-boolean-)
that selects of all the items of
[`FormState`](https://github.com/erikras/final-form#formstate) that you wish to
update for. If you don't pass a `subscription` prop, it defaults to _all_ of
[`FormState`](https://github.com/erikras/final-form#formstate).

### `FormSpyRenderProps`

These are the props that
[`<FormSpy/>`](#formspy--reactcomponenttypeformspyprops) provides to your render
function or component. These props are of type
[`FormState`](https://github.com/erikras/final-form#formstate). Keep in mind
that the values you receive here are dependent upon which values of
[`FormState`](https://github.com/erikras/final-form#formstate) you have
subscribed to with the
[`subscription` prop](https://github.com/erikras/react-final-form#subscription-formsubscription).
