# FAQ

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [Why not Redux-Form or Formik?](#why-not-redux-form-or-formik)
* [Why no HOC?](#why-no-hoc)
* [How can I trigger a submit from outside my form?](#how-can-i-trigger-a-submit-from-outside-my-form)
  * [Via `document.getElementById()`](#via-documentgetelementbyid)
  * [Via Closure](#via-closure)
  * [Via Redux Dead Drop](#via-redux-dead-drop)
* [Why can't I have numeric keys in an object?](#why-cant-i-have-numeric-keys-in-an-object)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Why not Redux-Form or Formik?

Those are both excellent form libraries. Like all engineering decisions, it
depends on your requirements and what trade-offs you wish to make.

## Why no HOC?

The only benefit that higher order components provide over render props is
access to the injected props from within component lifecycle methods. Plus, it
only takes a single line of code to transform a component with a `render` (or
`component`) prop into a HOC. If you really want a HOC, you can write your own:

```jsx
import { Form, Field } from 'react-final-form'

class MyForm extends React.Component {
  componentDidMount() {
    const { initialize } = this.props // access to injected props
    ajax.fetch('/myData').then(data => initialize(data))
  }

  render() {
    return <form onSubmit={this.props.handleSubmit}>...some fields...</form>
  }
}

// 👇 THIS LINE IS THE HOC 👇
export default props => <Form {...props} component={MyForm} />
```

Doing a HOC
[properly](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/withRouter.js),
as a library should, with hoisted statics and `displayName` and `ref`, etc., is
a hassle and would add unnecessary bulk.

## How can I trigger a submit from outside my form?

This is a common question I see from people migrating from `redux-form`. There
are three possible solutions:

### Via `document.getElementById()`

You can use the DOM to get a reference to your `<form>` element and dispatch a
submit event on it. Note that you cannot just call `submit()`, as this will not
trigger React's event handlers.

```jsx
<button onClick={() => {
  document.getElementById('myForm').submit() // ❌
}}>Submit</button>

<button onClick={() => {
  document.getElementById('myForm').dispatchEvent(new Event('submit')) // ✅
}}>Submit</button>

<form id="myForm" onSubmit={handleSubmit}>
  ...fields go here...
</form>
```

See [Sandbox Example](https://codesandbox.io/s/1y7noyrlmq).

### Via Closure

If you define a variable outside of your form, you can then set the value of
that variable to the `handleSubmit` function that 🏁 React Final Form gives you,
and then you can call that function from outside of the form.

```jsx
let submit
return (
  <div>
    <button onClick={submit}>Submit</button> // ❌ Not overwritten closure value
    <button onClick={event => submit(event)}>Submit</button> // ✅
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit }) => {
        submit = handleSubmit
        return <form>...fields go here...</form>
      }}
    />
  </div>
)
```

See [Sandbox Example](https://codesandbox.io/s/1y7noyrlmq).

### Via Redux Dead Drop

If you're already using Redux, you could potentially use the same mechanism that
`redux-form` uses:
[Redux Dead Drop](https://medium.com/@erikras/redux-dead-drop-1b9573705bec).

## Why can't I have numeric keys in an object?

So you want to have value structured like `{ 13: 'Bad Luck', 42: 'Meaning of Everything' }`, but you're getting an error. This is because the `setIn` engine in 🏁 Final Form uses the `isNaN`-ness of keys to determine whether or not it should create an object or an array when constructing deep data structures. Adding checks for `bracket[3]` syntax as opposed to `dot.3` syntax adds a _lot_ of complexity, and has consciously been avoided.

You will need to convert all your keys to `NaN` strings before initializing your form values, and then convert them back to numbers on submit. It's not that hard.

```jsx
const stringifyKeys = values =>
  Object.keys(values).reduce((result, key) => {
    result[`key${key}`] = values[key]
    return result
  }, {})

const destringifyKeys = values =>
  Object.keys(values).reduce((result, key) => {
    result[Number(key.substring(3))] = values[key]
    return result
  }, {})

<Form
  onSubmit={values => onSubmit(destringifyKeys(values))}
  initialValues={stringifyKeys(initialValues)}>
  ...
</Form>
```
