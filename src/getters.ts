import type { FormState, FieldState } from "final-form";

const addLazyState = (
  dest: Record<string, any>,
  state: Record<string, any>,
  keys: string[],
): void => {
  keys.forEach((key) => {
    Object.defineProperty(dest, key, {
      get: () => state[key],
      enumerable: true,
    });
  });
};

export const addLazyFormState = (
  dest: Record<string, any>,
  state: FormState<any>,
): void =>
  addLazyState(dest, state, [
    "active",
    "dirty",
    "dirtyFields",
    "dirtySinceLastSubmit",
    "dirtyFieldsSinceLastSubmit",
    "error",
    "errors",
    "hasSubmitErrors",
    "hasValidationErrors",
    "initialValues",
    "invalid",
    "modified",
    "modifiedSinceLastSubmit",
    "pristine",
    "submitError",
    "submitErrors",
    "submitFailed",
    "submitSucceeded",
    "submitting",
    "touched",
    "valid",
    "validating",
    "values",
    "visited",
  ]);

export const addLazyFieldMetaState = (
  dest: Record<string, any>,
  state: FieldState<any>,
): void =>
  addLazyState(dest, state, [
    "active",
    "data",
    "dirty",
    "dirtySinceLastSubmit",
    "error",
    "initial",
    "invalid",
    "length",
    "modified",
    "modifiedSinceLastSubmit",
    "pristine",
    "submitError",
    "submitFailed",
    "submitSucceeded",
    "submitting",
    "touched",
    "valid",
    "validating",
    "visited",
  ]);
