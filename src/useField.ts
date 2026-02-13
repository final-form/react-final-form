import * as React from "react";
import { fieldSubscriptionItems, getIn } from "final-form";
import type { FieldSubscription, FieldState, FormApi } from "final-form";
import type {
  UseFieldConfig,
  FieldInputProps,
  FieldRenderProps,
} from "./types";
import isReactNative from "./isReactNative";
import getValue from "./getValue";
import useForm from "./useForm";
import useLatest from "./useLatest";
import { addLazyFieldMetaState } from "./getters";
import useConstantCallback from "./useConstantCallback";
import shallowEqual from "./shallowEqual";

const all: FieldSubscription = fieldSubscriptionItems.reduce(
  (result: any, key) => {
    result[key] = true;
    return result;
  },
  {},
);

const defaultFormat = (value: any, _name: string) =>
  value === undefined ? "" : value;
const defaultParse = (value: any, _name: string) =>
  value === "" ? undefined : value;

const defaultIsEqual = (a: any, b: any): boolean => a === b;

function useField<
  FieldValue = any,
  T extends HTMLElement = HTMLElement,
  FormValues = Record<string, any>,
>(name: string, config: UseFieldConfig = {}): FieldRenderProps<FieldValue, T> {
  const {
    afterSubmit,
    allowNull,
    component,
    data,
    defaultValue,
    format = defaultFormat,
    formatOnBlur,
    initialValue,
    multiple,
    parse = defaultParse,
    subscription = all,
    type,
    validateFields,
    value: _value,
  } = config;
  const form: FormApi<FormValues> = useForm<FormValues>("useField");

  const configRef = useLatest(config);

  const register = (
    callback: (state: FieldState<any>) => void,
    silent: boolean,
  ) =>
    // avoid using `state` const in any closures created inside `register`
    // because they would refer `state` from current execution context
    // whereas actual `state` would defined in the subsequent `useField` hook
    // execution
    // (that would be caused by `setState` call performed in `register` callback)
    form.registerField(name as keyof FormValues, callback, subscription, {
      afterSubmit,
      beforeSubmit: () => {
        const {
          beforeSubmit,
          formatOnBlur,
          format = defaultFormat,
        } = configRef.current;

        if (formatOnBlur) {
          const fieldState = form.getFieldState(name as keyof FormValues);
          if (fieldState) {
            const { value } = fieldState;
            const formatted = format(value, name);

            if (formatted !== value) {
              form.change(name as keyof FormValues, formatted);
            }
          }
        }

        return beforeSubmit && beforeSubmit();
      },
      data,
      defaultValue,
      getValidator: () => configRef.current.validate,
      initialValue,
      isEqual: configRef.current.isEqual,
      silent,
      validateFields,
    });

  // Initialize state with proper field state from Final Form without callbacks
  const [state, setState] = React.useState<FieldState<any>>(() => {
    // Get the current field state from Final Form without registering callbacks
    const existingFieldState = form.getFieldState(name as keyof FormValues);

    if (existingFieldState) {
      // If allowNull is true and the initial value was null, preserve it
      // (and its formatted version is not null, meaning it was formatted away)
      if (allowNull && existingFieldState.initial === null && existingFieldState.value !== null) {
        return {
          ...existingFieldState,
          value: null,   // Force value back to null
          initial: null, // Ensure our local state's 'initial' also reflects this
        };
      }
      return existingFieldState;
    }

    // FIX #1050: Check Form initialValues before falling back to field initialValue
    // If no existing state, create a proper initial state
    const formState = form.getState();
    // Use getIn to support nested field paths like "user.name" or "items[0].id"
    const formInitialValue = getIn(formState.initialValues, name);
    
    // Use Form initialValues if available, otherwise use field initialValue
    let initialStateValue = formInitialValue !== undefined ? formInitialValue : initialValue;
    
    if ((component === "select" || type === "select") && multiple && initialStateValue === undefined) {
      initialStateValue = [];
    }

    return {
      active: false,
      blur: () => { },
      change: () => { },
      data: data || {},
      dirty: false,
      dirtySinceLastSubmit: false,
      error: undefined,
      focus: () => { },
      initial: initialStateValue,
      invalid: false,
      length: undefined,
      modified: false,
      modifiedSinceLastSubmit: false,
      name,
      pristine: true,
      submitError: undefined,
      submitFailed: false,
      submitSucceeded: false,
      submitting: false,
      touched: false,
      valid: true,
      validating: false,
      value: initialStateValue,
      visited: false,
    };
  });

  React.useEffect(() => {
    // Check if field state exists in the form before registering
    const existingFieldState = form.getFieldState(name as keyof FormValues);
    
    // If field doesn't exist in form state, it means the field was destroyed 
    // (e.g., by destroyOnUnregister in StrictMode). In this case, we need to 
    // explicitly set the value before registering to ensure the initial value 
    // is applied, even if form thinks initialValues haven't changed.
    if (!existingFieldState) {
      const formState = form.getState();
      const formInitialValue = getIn(formState.initialValues, name);
      const valueToSet = formInitialValue !== undefined ? formInitialValue : initialValue;
      if (valueToSet !== undefined) {
        form.change(name as keyof FormValues, valueToSet);
      }
    }

    // Register field after the initial render to avoid setState during render
    const unregister = register((newState) => {
      setState((prevState) => {
        // Only update if the state actually changed
        if (!shallowEqual(newState, prevState)) {
          return newState;
        }
        return prevState;
      });
    }, false);

    return unregister;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, data, defaultValue, initialValue]);

  const meta: any = {};
  addLazyFieldMetaState(meta, state);
  const getInputValue = () => {
    let value = state.value;

    // Handle null values first
    if (value === null && !allowNull) {
      value = "";
    }

    if (formatOnBlur) {
      if (component === "input") {
        value = defaultFormat(value, name);
      }
    } else {
      // Only format if value is not null when allowNull is true
      if (!(allowNull && value === null)) {
        value = format(value, name);
      }
    }

    if ((component === "select" || type === "select") && multiple) {
      return Array.isArray(value) ? value : [];
    }
    // For checkboxes and radios, the `value` prop on the input element itself
    // is not the array of selected values or the single selected radio value,
    // but rather the specific value this input represents if selected.
    // The `checked` prop handles the actual selection state.
    // So, for `input.value`, we should return `_value` if provided (for individual inputs in a group)
    // or the formatted field value otherwise (for standalone inputs).
    if ((type === "checkbox" || type === "radio") && _value !== undefined) {
      return _value;
    }
    return value;
  };

  const getInputChecked = () => {
    let value = state.value;
    if (type === "checkbox") {
      value = format(value, name);
      if (_value === undefined) {
        return !!value;
      } else {
        return !!(Array.isArray(value) && ~value.indexOf(_value));
      }
    } else if (type === "radio") {
      return format(value, name) === _value;
    }
    return undefined;
  };

  const input: FieldInputProps<FieldValue, T> = {
    name,
    onBlur: useConstantCallback((_event?: React.FocusEvent<any>) => {
      state.blur();
      if (formatOnBlur) {
        /**
         * Here we must fetch the value directly from Final Form because we cannot
         * trust that our `state` closure has the most recent value. This is a problem
         * if-and-only-if the library consumer has called `onChange()` immediately
         * before calling `onBlur()`, but before the field has had a chance to receive
         * the value update from Final Form.
         */
        const fieldState = form.getFieldState(state.name as keyof FormValues);
        if (fieldState) {
          state.change(format(fieldState.value, state.name));
        }
      }
    }),
    onChange: useConstantCallback((event: React.ChangeEvent<any> | any) => {
      // istanbul ignore next
      if (process.env.NODE_ENV !== "production" && event && event.target) {
        const targetType = event.target.type;
        const unknown =
          ~["checkbox", "radio", "select-multiple"].indexOf(targetType) &&
          !type &&
          component !== "select";

        const value: any =
          targetType === "select-multiple" ? state.value : _value;

        if (unknown) {
          console.error(
            `You must pass \`type="${targetType === "select-multiple" ? "select" : targetType
            }"\` prop to your Field(${name}) component.\n` +
            `Without it we don't know how to unpack your \`value\` prop - ${Array.isArray(value) ? `[${value}]` : `"${value}"`
            }.`,
          );
        }
      }

      const value: any =
        event && event.target
          ? getValue(event, state.value, _value, isReactNative)
          : event;
      state.change(parse(value, name));
    }),
    onFocus: useConstantCallback((_event?: React.FocusEvent<any>) =>
      state.focus(),
    ),
    get value() {
      return getInputValue();
    },
    get checked() {
      return getInputChecked();
    },
  };

  if (multiple) {
    input.multiple = multiple;
  }
  if (type !== undefined) {
    input.type = type;
  }

  const renderProps: FieldRenderProps<FieldValue, T> = { input, meta }; // assign to force type check
  return renderProps;
}

export default useField;
