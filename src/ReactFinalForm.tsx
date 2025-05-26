import * as React from "react";
import {
  createForm,
  formSubscriptionItems,
  version as ffVersion,
} from "final-form";
import type {
  FormApi,
  Config,
  FormSubscription,
  FormState,
  Unsubscribe,
} from "final-form";
import type { FormProps, SubmitEvent } from "./types";
import renderComponent from "./renderComponent";
import useWhenValueChanges from "./useWhenValueChanges";
import useConstant from "./useConstant";
import shallowEqual from "./shallowEqual";
import isSyntheticEvent from "./isSyntheticEvent";
import type { FormRenderProps } from "./types";
import ReactFinalFormContext from "./context";
import { addLazyFormState } from "./getters";
import { version } from "../package.json";

export { version };

const versions = {
  "final-form": ffVersion,
  "react-final-form": version,
};

export const all = formSubscriptionItems.reduce<FormSubscription>(
  (result: FormSubscription, key: keyof FormSubscription) => {
    result[key] = true;
    return result;
  },
  {},
);

function ReactFinalForm<FormValues = Record<string, any>>({
  debug,
  decorators = [],
  destroyOnUnregister,
  form: alternateFormApi,
  initialValues,
  initialValuesEqual,
  keepDirtyOnReinitialize,
  mutators,
  onSubmit,
  subscription = all,
  validate,
  validateOnBlur,
  ...rest
}: FormProps<FormValues>) {
  const config: Config<FormValues> = {
    debug,
    destroyOnUnregister,
    initialValues,
    keepDirtyOnReinitialize,
    mutators,
    onSubmit,
    validate,
    validateOnBlur,
  };

  const form: FormApi<FormValues> = useConstant(() => {
    const f = alternateFormApi || createForm<FormValues>(config);
    // pause validation until children register all fields on first render (unpaused in useEffect() below)
    f.pauseValidation();
    return f;
  });

  // Get initial state without triggering callbacks during render
  const [state, setState] = React.useState<FormState<FormValues>>(() => {
    // Get initial state synchronously but without callbacks
    return form.getState();
  });

  // save a copy of state that can break through the closure
  // on the shallowEqual() line below.
  const stateRef = React.useRef<FormState<FormValues>>(state);
  stateRef.current = state;

  React.useEffect(() => {
    // We have rendered, so all fields are now registered, so we can unpause validation
    form.isValidationPaused() && form.resumeValidation();
    const unsubscriptions: Unsubscribe[] = [
      form.subscribe((s) => {
        setState((prevState) => {
          if (!shallowEqual(s, prevState)) {
            return s;
          }
          return prevState;
        });
      }, subscription),
      ...(decorators ? decorators.map((decorator) => decorator(form)) : []),
    ];

    return () => {
      form.pauseValidation(); // pause validation so we don't revalidate on every field deregistration
      unsubscriptions.reverse().forEach((unsubscribe) => unsubscribe());
      // don't need to resume validation here; either unmounting, or will re-run this hook with new deps
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // warn about decorator changes
  // istanbul ignore next
  if (process.env.NODE_ENV !== "production") {
    // You're never supposed to use hooks inside a conditional, but in this
    // case we can be certain that you're not going to be changing your
    // NODE_ENV between renders, so this is safe.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useWhenValueChanges(
      decorators,
      () => {
        console.error(
          "Form decorators should not change from one render to the next as new values will be ignored",
        );
      },
      shallowEqual,
    );
  }

  // allow updatable config
  useWhenValueChanges(debug, () => {
    form.setConfig("debug", debug);
  });
  useWhenValueChanges(destroyOnUnregister, () => {
    form.destroyOnUnregister = !!destroyOnUnregister;
  });
  useWhenValueChanges(keepDirtyOnReinitialize, () => {
    form.setConfig("keepDirtyOnReinitialize", keepDirtyOnReinitialize);
  });
  useWhenValueChanges(
    initialValues,
    () => {
      form.setConfig("initialValues", initialValues);
    },
    initialValuesEqual || shallowEqual,
  );
  useWhenValueChanges(mutators, () => {
    form.setConfig("mutators", mutators);
  });
  useWhenValueChanges(onSubmit, () => {
    form.setConfig("onSubmit", onSubmit);
  });
  useWhenValueChanges(validate, () => {
    form.setConfig("validate", validate);
  });
  useWhenValueChanges(validateOnBlur, () => {
    form.setConfig("validateOnBlur", validateOnBlur);
  });

  const handleSubmit = (event?: SubmitEvent) => {
    if (event) {
      // sometimes not true, e.g. React Native
      if (typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      if (typeof event.stopPropagation === "function") {
        // prevent any outer forms from receiving the event too
        event.stopPropagation();
      }
    }
    return form.submit();
  };

  const renderProps: FormRenderProps<FormValues> = {
    form: {
      ...form,
      reset: (eventOrValues?: any) => {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          form.reset();
        } else {
          form.reset(eventOrValues);
        }
      },
    },
    handleSubmit,
  } as FormRenderProps<FormValues>;
  addLazyFormState(renderProps, state);
  return React.createElement(
    ReactFinalFormContext.Provider,
    { value: form },
    renderComponent(
      {
        ...rest,
        __versions: versions,
      },
      renderProps,
      "ReactFinalForm",
    ),
  );
}

export default ReactFinalForm;
