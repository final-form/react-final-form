import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import createReduxPromiseListener from "redux-promise-listener";
import registration from "./registrationDuck";
import asyncSubmissionMiddleware from "./asyncSubmissionMiddleware";

const reduxPromiseListener = createReduxPromiseListener();

const logger =
  (store) =>
  (next: Next) =>
  (action: Action): State => {
    console.log(action);
    return next(action);
  };

const reducer = combineReducers({
  registration,
});

const composeEnhancers =
  (typeof window !== "undefined" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(
  reducer,
  {},
  composeEnhancers(
    applyMiddleware(
      reduxPromiseListener.middleware,
      asyncSubmissionMiddleware,
      logger,
    ),
  ),
);

export const promiseListener = reduxPromiseListener; // <---------- IMPORTANT

export default store;
