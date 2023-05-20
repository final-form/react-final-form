// @flow
import * as React from "react";
import { fieldSubscriptionItems } from "final-form";
import type {
  FieldSubscription,
  FieldState,
  FormApi,
  FormValuesShape,
} from "final-form";
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

const all: FieldSubscription = fieldSubscriptionItems.reduce((result, key) => {
  result[key] = true;
  return result;
}, {});

const defaultFormat = (value: ?any, name: string) =>
  value === undefined ? "" : value;
const defaultParse = (value: ?any, name: string) =>
  value === "" ? undefined : value;

const defaultIsEqual = (a: any, b: any): boolean => a === b;

function useField<FormValues: FormValuesShape>(
  name: string,
  config: UseFieldConfig = {},
): FieldRenderProps {
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

  const register = (callback: (FieldState) => void, silent: boolean) =>
    // avoid using `state` const in any closures created inside `register`
    // because they would refer `state` from current execution context
    // whereas actual `state` would defined in the subsequent `useField` hook
    // execution
    // (that would be caused by `setState` call performed in `register` callback)
    form.registerField(name, callback, subscription, {
      afterSubmit,
      beforeSubmit: () => {
        const {
          beforeSubmit,
          formatOnBlur,
          format = defaultFormat,
        } = configRef.current;

        if (formatOnBlur) {
          const { value } = ((form.getFieldState(name): any): FieldState);
          const formatted = format(value, name);

          if (formatted !== value) {
            form.change(name, formatted);
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

  const firstRender = React.useRef(true);

  // synchronously register and unregister to query field state for our subscription on first render
  const [state, setState] = React.useState<FieldState>((): FieldState => {
    let initialState: FieldState = {};

    // temporarily disable destroyOnUnregister
    const destroyOnUnregister = form.destroyOnUnregister;
    form.destroyOnUnregister = false;

    register((state) => {
      initialState = state;
    }, true)();

    // return destroyOnUnregister to its original value
    form.destroyOnUnregister = destroyOnUnregister;

    return initialState;
  });

  React.useEffect(
    () =>
      register((state) => {
        if (firstRender.current) {
          firstRender.current = false;
        } else {
          setState(state);
        }
      }, false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      name,
      data,
      defaultValue,
      // If we want to allow inline fat-arrow field-level validation functions, we
      // cannot reregister field every time validate function !==.
      // validate,
      initialValue,
      // The validateFields array is often passed as validateFields={[]}, creating
      // a !== new array every time. If it needs to be changed, a rerender/reregister
      // can be forced by changing the key prop
      // validateFields
    ],
  );

  const meta = {};
  addLazyFieldMetaState(meta, state);
  const input: FieldInputProps = {
    name,
    get value() {
      let value = state.value;
      if (formatOnBlur) {
        if (component === "input") {
          value = defaultFormat(value, name);
        }
      } else {
        value = format(value, name);
      }
      if (value === null && !allowNull) {
        value = "";
      }
      if (type === "checkbox" || type === "radio") {
        return _value;
      } else if (component === "select" && multiple) {
        return value || [];
      }
      return value;
    },
    get checked() {
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
    },
    onBlur: useConstantCallback((event: ?SyntheticFocusEvent<*>) => {
      state.blur();
      if (formatOnBlur) {
        /**
         * Here we must fetch the value directly from Final Form because we cannot
         * trust that our `state` closure has the most recent value. This is a problem
         * if-and-only-if the library consumer has called `onChange()` immediately
         * before calling `onBlur()`, but before the field has had a chance to receive
         * the value update from Final Form.
         */
        const fieldState: any = form.getFieldState(state.name);
        state.change(format(fieldState.value, state.name));
      }
    }),
    onChange: useConstantCallback((event: SyntheticInputEvent<*> | any) => {
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
            `You must pass \`type="${
              targetType === "select-multiple" ? "select" : targetType
            }"\` prop to your Field(${name}) component.\n` +
              `Without it we don't know how to unpack your \`value\` prop - ${
                Array.isArray(value) ? `[${value}]` : `"${value}"`
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
    onFocus: useConstantCallback((event: ?SyntheticFocusEvent<*>) =>
      state.focus(),
    ),
  };

  if (multiple) {
    input.multiple = multiple;
  }
  if (type !== undefined) {
    input.type = type;
  }

  const renderProps: FieldRenderProps = { input, meta }; // assign to force Flow check
  return renderProps;
}

export default useField;
