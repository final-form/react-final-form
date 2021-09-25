// @flow
import * as React from "react";
import type { UseFormStateParams } from "./types";
import type { FormState, FormApi, FormValuesShape } from "final-form";
import { all } from "./ReactFinalForm";
import useForm from "./useForm";
import { addLazyFormState } from "./getters";

function useFormState<FormValues: FormValuesShape>({
  onChange,
  subscription = all,
}: UseFormStateParams<FormValues> = {}): FormState<FormValues> {
  const form: FormApi<FormValues> = useForm<FormValues>("useFormState");
  const firstRender = React.useRef(true);
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FormState<FormValues>>(
    (): FormState<FormValues> => {
      let initialState: FormState<FormValues> = {};
      form.subscribe((state) => {
        initialState = state;
      }, subscription)();
      if (onChange) {
        onChange(initialState);
      }
      return initialState;
    },
  );

  React.useEffect(
    () =>
      form.subscribe((newState) => {
        if (firstRender.current) {
          firstRender.current = false;
        } else {
          setState(newState);
          if (onChangeRef.current) {
            onChangeRef.current(newState);
          }
        }
      }, subscription),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const lazyState = {};
  addLazyFormState(lazyState, state);
  return lazyState;
}

export default useFormState;
