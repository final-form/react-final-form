[<img src="form-nerd-logo.png" align="left"/>](https://formnerd.co/react-final-form-readme) **You build great forms, but do you know HOW users use your forms? [Find out with Form Nerd!](https://formnerd.co/react-final-form-readme) Professional analytics from the creator of React Final Form.**

---

# 🏁 React Final Form

[![React Final Form](banner.png)](https://final-form.org/react)

[![Backers on Open Collective](https://opencollective.com/final-form/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/final-form/sponsors/badge.svg)](#sponsors) [![NPM Version](https://img.shields.io/npm/v/react-final-form.svg?style=flat)](https://www.npmjs.com/package/react-final-form)
[![NPM Downloads](https://img.shields.io/npm/dm/react-final-form.svg?style=flat)](https://www.npmjs.com/package/react-final-form)
[![Build Status](https://travis-ci.org/final-form/react-final-form.svg?branch=master)](https://travis-ci.org/final-form/react-final-form)
[![codecov.io](https://codecov.io/gh/final-form/react-final-form/branch/master/graph/badge.svg)](https://codecov.io/gh/final-form/react-final-form)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

✅ Zero dependencies

✅ Only peer dependencies: React and
[🏁 Final Form](https://github.com/final-form/final-form#-final-form)

✅ Opt-in subscriptions - only update on the state you need!

✅ 💥 [**3.0k gzipped**](https://bundlephobia.com/result?p=react-final-form) 💥

---

## 💬 [Give Feedback on React Final Form](https://goo.gl/forms/dxdfxKNy64DLb99z2) 💬

In the interest of making 🏁 React Final Form the best library it can be, we'd love your thoughts and feedback.

[Take a quick survey](https://goo.gl/forms/dxdfxKNy64DLb99z2).

---

## Broken forwardRef, DO not use unless you don't need to have `ref` for your form component

<div style="text-align: center">
  <img src="https://findicons.com/files/icons/811/developer_kit/128/warning.png" alt="read carefully" />
</div>
There is a known issue that affect many `react-dom` users and all `react-native` users concerning `ref` and more specifically, the `forwardRef` feature not being implemented. If you need to have a reference to your form component, we recommend you to use [`react-hook-form`](https://react-hook-form.com/)

- https://github.com/final-form/react-final-form/issues/483
- https://github.com/final-form/react-final-form/issues/779

There is a pull request that require some final help with someone experienced with `Flow`, see https://github.com/final-form/react-final-form/pull/608

---

React Final Form is a thin React wrapper for [Final Form](https://final-form.org), which is a subscriptions-based form state management library that uses the [Observer pattern](https://en.wikipedia.org/wiki/Observer_pattern), so only the components that need updating are re-rendered as the form's state changes.

## [Getting Started](https://final-form.org/docs/react-final-form/getting-started)

## [Philosophy](https://final-form.org/docs/react-final-form/philosophy)

## [Examples](https://final-form.org/docs/react-final-form/examples)

## [API](https://final-form.org/docs/react-final-form/api)

## [FAQ](https://final-form.org/docs/react-final-form/faq)
