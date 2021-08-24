# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/faq). Links may not work on Github.com.

# FAQ

Below are some frequently asked questions.

## Why not Redux-Form or Formik?

Those are both excellent form libraries. Like all engineering decisions, it depends on your requirements and what trade-offs you wish to make. Both Redux-Form and Formik have considerably larger bundle sizes. Compare [Formik](https://bundlephobia.com/result?p=formik) and [Redux Form](https://bundlephobia.com/result?p=redux-form) to [Final Form](https://bundlephobia.com/result?p=final-form) + [React Final Form](https://bundlephobia.com/result?p=react-final-form).

Redux-Form and React Final Form were both written by [@erikras](https://twitter.com/erikras), who recommends that, unless you _really_ need your form data intimately tied to Redux, you should start any new projects with React Final Form, and try to migrate any older Redux Form projects to it as well.

## Why no HOC?

The only benefit that higher order components provide over render props is access to the injected props from within component lifecycle methods. Plus, it only takes a single line of code to transform a component with a `render` (or `component`) prop into a HOC. If you really want a HOC, you can write your own:

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

### Via the `form` attribute

You can provide the form id to a submit button.


```jsx
<button type="submit" form="myForm">Submit</button>
{/*                   ^^^^^^^^^^^^^ */}

<form id="myForm" onSubmit={handleSubmit}>
{/*   ^^^^^^^^^^^ */}
  ...fields go here...
</form>
```

### Via `document.getElementById()`

You can use the DOM to get a reference to your `<form>` element and dispatch a
submit event on it. Note that you cannot just call `submit()`, as this will not
trigger React's event handlers.

```jsx
<button onClick={() => {
  document.getElementById('myForm').submit() // ❌
}}>Submit</button>

<button onClick={() => {
  document.getElementById('myForm')
  .dispatchEvent(new Event('submit', { cancelable: true, bubbles:true })) // ✅
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

## I'm changing form state on first render, e.g. with FormSpy, why are my changes not reflected?

As of `v5`, the only changes that occur during the first render that will cause the form to rerender are if adding field-level validation functions changes the validity of the form. You will need to put your side effect into either a React `useEffect` hook, or just call it in a `setTimeout` to allow the form to finish rendering and setting up its side effects before you go altering the state.
