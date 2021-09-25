// QUACK! This is a duck. https://github.com/erikras/ducks-modular-redux

// Actions
export const REGISTER = "final-form-examples/registration/REGISTER";
export const REGISTER_SUCCESS =
  "final-form-examples/registration/REGISTER_SUCCESS";
export const REGISTER_FAILURE =
  "final-form-examples/registration/REGISTER_FAILURE";

// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    case REGISTER:
      return {
        ...state,
        registering: true,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        registering: false,
      };
    case REGISTER_FAILURE:
      return {
        ...state,
        registering: false,
      };
    default:
      return state;
  }
}

// Action Creators

// Selectors
