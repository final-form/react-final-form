# This documentation is meant to be read on [final-form.org](https://final-form.org/docs/react-final-form/philosophy). Links may not work on Github.com.

# Philosophy

For several years, I ([@erikras](https://twitter.com/erikras)) actively maintained the first big form library in the React community, [Redux Form](https://redux-form.com). During those years, I learned many lessons, about open source and React, and saw hundreds of forms use cases from around the world. As Redux Form grew in popularity (and bundle size), I received a lot of feedback from the community. React Final Form is my answer to the concerns of the community.

## Talk

In this talk, I explain the journey through Redux Form to the conception and creation of React Final Form.

[Next Generation Forms with React Final Form – React Alicante 2018, Alicante, Spain](https://youtu.be/WoSzy-4mviQ)

## Goals

React Final Form strives to meet the following goals:

### Strongly Typed

React Final Form provides strong typing via both [Flow](https://flow.org) and [Typescript](https://www.typescriptlang.org) to allow you to catch common bugs _at coding time_.

### Modularity

Just because some forms can be complex doesn't mean that your users should need to download all that code for a simple form! React Final Form and Final Form break out complex functionality into separate packages, so the form state management core doesn't get bloated by complicated use cases. This allows you to _build the form library you need_ for every use case.

Also, this allows for...

### Minimal Bundle Size

React Final Form is a minimal wrapper around the _zero-dependency_ Final Form core. All React Final Form does is know how to get form values out of [`SyntheticEvent`](https://reactjs.org/docs/events.html) and manage field subscriptions to the form.

### High Performance

You probably won't need to fine-tune your form performance, but if your form grows and starts to lag, you'll be glad you've chosen React Final Form. Every bit of form and field state can be chosen _à la carte_ to trigger a rerender in React.

If you're familiar with Redux in React, it's a little bit like how you can use [selectors](https://redux.js.org/recipes/computing-derived-data) to specify exactly which "slice" of state you want your component to be notified about.

The result is that you can streamline your form for maximum performance.

[Ready to get started?](getting-started)
