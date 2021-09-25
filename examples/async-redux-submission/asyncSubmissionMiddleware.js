import { REGISTER, REGISTER_SUCCESS } from "./registrationDuck";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submit = async (values) => {
  await sleep(200);
  if (values.firstName === "John") {
    throw Error({ firstName: "No John's Allowed!" });
  }
  window.alert(JSON.stringify(values, 0, 2));
};

/** This is to mimic the behavior of one of the various Redux async middlewares */
const asyncSubmissionMiddleware =
  (store) =>
  (next: Next) =>
  (action: Action): State => {
    if (action && action.type === REGISTER) {
      submit(action.payload).then(
        () => store.dispatch({ type: REGISTER_SUCCESS }),
        (errors) => {
          // NOTE!! We are passing REGISTER_SUCCESS here because 🏁 Final Form expects
          // submit errors to come back in a *resolved* promise.
          store.dispatch({ type: REGISTER_SUCCESS, payload: errors });
        },
      );
    }
    return next(action);
  };

export default asyncSubmissionMiddleware;
