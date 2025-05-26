import * as React from "react";
import type { UseFormStateParams } from "./types";
import type { FormState, FormApi } from "final-form";
import { all } from "./ReactFinalForm";
import useForm from "./useForm";
import { addLazyFormState } from "./getters";
import shallowEqual from "./shallowEqual";

function useFormState<FormValues = Record<string, any>>({
  onChange,
  subscription = all,
}: UseFormStateParams<FormValues> = {}): FormState<FormValues> {
  const form: FormApi<FormValues> = useForm<FormValues>("useFormState");
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  // Initialize state with current form state without callbacks
  const [state, setState] = React.useState<FormState<FormValues>>(() => {
    // Get initial state synchronously but without callbacks
    return form.getState();
  });

  React.useEffect(() => {
    // Subscribe to form state changes after initial render
    const unsubscribe = form.subscribe((newState) => {
      setState((prevState) => {
        if (!shallowEqual(newState, prevState)) {
          if (onChangeRef.current) {
            onChangeRef.current(newState);
          }
          return newState;
        }
        return prevState;
      });
    }, subscription);

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lazyState = {};
  addLazyFormState(lazyState, state);
  return lazyState as FormState<FormValues>;
}

export default useFormState;
