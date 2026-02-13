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

  // Initialize with current form state WITHOUT triggering callbacks during render.
  // We intentionally use getState() here so render-prop consumers (e.g. <FormSpy>{...})
  // can read a fully-populated initial state on first render.
  const [state, setState] = React.useState<FormState<FormValues>>(() =>
    form.getState(),
  );

  // We want `onChange` to be called AFTER render (fixes #809) and only with the
  // subscription-filtered state.
  const firstSubscriptionRef = React.useRef(true);
  const pendingOnChangeRef = React.useRef<FormState<FormValues> | null>(null);
  const lastOnChangeRef = React.useRef<FormState<FormValues> | null>(null);

  React.useEffect(() => {
    const unsubscribe = form.subscribe((newState) => {
      // Ensure we set state at least once from the subscription, even if equal,
      // so that `onChange` can be fired from an effect after the first render.
      const isFirst = firstSubscriptionRef.current;
      if (isFirst) {
        firstSubscriptionRef.current = false;
      }

      pendingOnChangeRef.current = newState;

      setState((prevState) => {
        if (isFirst || !shallowEqual(newState, prevState)) {
          return newState;
        }
        return prevState;
      });
    }, subscription);

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const pending = pendingOnChangeRef.current;
    if (!pending || !onChangeRef.current) {
      return;
    }

    // Only fire when the subscription has produced a new state and it differs
    // from what we've already emitted.
    if (lastOnChangeRef.current === null || !shallowEqual(pending, lastOnChangeRef.current)) {
      onChangeRef.current(pending);
      lastOnChangeRef.current = pending;
    }

    // Clear pending once we've handled it.
    pendingOnChangeRef.current = null;
  }, [state]);

  const lazyState = {};
  addLazyFormState(lazyState, state);
  return lazyState as FormState<FormValues>;
}

export default useFormState;
