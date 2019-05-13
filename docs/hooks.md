# Using 🏁 React Final Form with Hooks

If you would like to define your entire form in a single component and use hooks to get your form and field state, you should use [🏁 React Final Form Hooks](https://github.com/final-form/react-final-form-hooks#-react-final-form-hooks), but be aware that _your entire form will render on every single state change (key press)_. If you don't care about that, and perhaps you do not if your form is tiny, then 🏁 React Final Form Hooks is the leanest, easiest way to utilize the power of the 🏁 Final Form engine in your React app.

The 🏁 React Final Form library, however, from its initial release, has always been focused on giving you the power to control precisely when elements of your form rerender as your form state changes. If you need fine control over how your form rerenders, _you cannot use hooks in a single component_, as the entire component has to render every time. There are still some usecases where render props are superior to hooks, and this is one of them.

As of v5.0, 🏁 React Final Form exports `useField` and `useFormState` hooks that, crucially, are the exact same hooks that `Field` and `FormSpy` respectively use internally.

I'm going to make this next part bigger so that it really gets through:

## ⚠️ If you need fine control over how parts of your form rerender, you must use the render prop API, not hooks! ⚠️

Below will be some examples once I work them out in code sandbox. Hold tight!
