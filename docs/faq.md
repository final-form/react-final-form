<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with
[DocToc](https://github.com/thlorenz/doctoc)_

* [FAQ](#faq)
  * [Why not Redux-Form or Formik?](#why-not-redux-form-or-formik)
  * [Why no HOC?](#why-no-hoc)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# FAQ

## Why not Redux-Form or Formik?

Those are both excellent form libraries. Like all engineering decisions, it
depends on your requirements and what trade-offs you wish to make. Here is a
[Comparison Table](comparison.md).

## Why no HOC?

The only benefit that higher order components provide over render props is
access to the injected props from within component lifecycle methods. Plus, it
only takes a single line of code to transform a component with a render prop
into a HOC. If you really want a HOC, you can write your own:

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
