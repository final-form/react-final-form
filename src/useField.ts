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

// Helper to build fallback field state when field is not yet registered
const buildFallbackFieldState = (
  name: string,
  form: FormApi<any>,
  initialValue: any,
  defaultValue: any,
  component: string | undefined,
  multiple: boolean | undefined,
  allowNull: boolean | undefined,
  data: any,
  stableBlur: () => void,
  stableChange: () => void,
  stableFocus: () => void,
): FieldState<any> => {
  const formState = form.getState();
  
  // Priority order: live values > initialValues > initialValue prop > defaultValue > select multiple default
  let value: any;
  const liveValue = getIn(formState.values, name);
  if (liveValue !== undefined) {
    value = liveValue;
  } else {
    const formInitialValue = getIn(formState.initialValues, name);
    if (formInitialValue !== undefined) {
      value = formInitialValue;
    } else if (initialValue !== undefined) {
      value = initialValue;
    } else if (defaultValue !== undefined) {
      value = defaultValue;
    } else if (component === "select" && multiple) {
      value = [];
    }
  }

  // Handle allowNull
  if (value === null && !allowNull) {
    value = undefined;
  }

  return {
    active: false,
    blur: stableBlur,
    change: stableChange,
    data,
    dirty: false,
    dirtySinceLastSubmit: false,
    error: undefined,
    focus: stableFocus,
    initial: value,
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
    visited: false,
    value,
  } as FieldState<any>;
};

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
      isEqual: (a: any, b: any) => (configRef.current.isEqual || defaultIsEqual)(a, b),
      silent,
      validateFields,
    });

  // FIX #1050: Use useSyncExternalStore to properly integrate with Final Form
  // This ensures Form initialValues are available on first render without
  // causing side effects during render (React 18+ best practice)
  
  // Stable no-op functions for unregistered field state
  const stableBlur = React.useCallback(() => {}, []);
  const stableChange = React.useCallback(() => {}, []);
  const stableFocus = React.useCallback(() => {}, []);

  // Memoized fallback state for when field is not yet registered
  const fallbackStateRef = React.useRef<FieldState<any> | null>(null);
  
  // Reset fallback state when key dependencies change to avoid stale values
  React.useEffect(() => {
    fallbackStateRef.current = null;
  }, [name, initialValue, defaultValue, data, allowNull, component, multiple]);
  
  const state = React.useSyncExternalStore(
    // subscribe: called when component mounts and when dependencies change
    React.useCallback(
      (onStoreChange) => {
        return register((_fieldState) => {
          onStoreChange();
        }, false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [name, data, defaultValue, initialValue],
    ),
    // getSnapshot: return current field state (must be idempotent)
    () => {
      const fieldState = form.getFieldState(name as keyof FormValues);
      if (fieldState) {
        return fieldState;
      }
      
      // Return memoized fallback state if field not registered yet
      // Must return same object reference for React 18 stability
      if (!fallbackStateRef.current) {
        fallbackStateRef.current = buildFallbackFieldState(
          name,
          form,
          initialValue,
          defaultValue,
          component,
          multiple,
          allowNull,
          data,
          stableBlur,
          stableChange,
          stableFocus,
        );
      }
      
      return fallbackStateRef.current;
    },
    // getServerSnapshot: for SSR, return initial state (same as fallback)
    () => {
      // For SSR, we can return the fallback state which has stable references
      if (!fallbackStateRef.current) {
        fallbackStateRef.current = buildFallbackFieldState(
          name,
          form,
          initialValue,
          defaultValue,
          component,
          multiple,
          allowNull,
          data,
          stableBlur,
          stableChange,
          stableFocus,
        );
      }
      
      return fallbackStateRef.current;
    },
  );

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

    if (component === "select" && multiple) {
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
