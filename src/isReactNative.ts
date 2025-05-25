const isReactNative: boolean = !!(
  typeof window !== "undefined" &&
  window.navigator &&
  window.navigator.product &&
  window.navigator.product === "ReactNative"
);

export default isReactNative;
