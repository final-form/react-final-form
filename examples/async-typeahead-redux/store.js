import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const initialState = {};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "GITHUB_USERS_REQUEST":
      return {
        ...state,
        [action.query]: {
          ...state[action.query],
          loading: true,
        },
      };
    case "GITHUB_USERS_RESPONSE":
      return {
        ...state,
        [action.query]: {
          value: action.users,
          loading: false,
        },
      };
    default:
      return state;
  }
};

export default () => createStore(reducer, undefined, applyMiddleware(thunk));
