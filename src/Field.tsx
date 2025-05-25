import * as React from "react";
import type { FieldProps, FieldRenderProps } from "./types";
import renderComponent from "./renderComponent";
import useField from "./useField";

function FieldComponent<
  FieldValue = any,
  T extends HTMLElement = HTMLElement,
  FormValues = Record<string, any>,
>(
  {
    afterSubmit,
    allowNull,
    beforeSubmit,
    children,
    component,
    data,
    defaultValue,
    format,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    name,
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value,
    ...rest
  }: FieldProps<FieldValue, T, FormValues>,
  ref: React.Ref<T>,
) {
  const field: FieldRenderProps<FieldValue, T> = useField(name, {
    afterSubmit,
    allowNull,
    beforeSubmit,
    component,
    data,
    defaultValue,
    format,
    formatOnBlur,
    initialValue,
    isEqual,
    multiple,
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value,
  });

  if (typeof children === "function") {
    return (
      children as (
        props: FieldRenderProps<FieldValue, T> & typeof rest,
      ) => React.ReactNode
    )({ ...field, ...rest });
  }

  if (typeof component === "string") {
    // ignore meta, combine input with any other props
    const inputProps = { ...field.input };

    // Ensure multiple select has array value
    if (
      component === "select" &&
      multiple &&
      !Array.isArray(inputProps.value)
    ) {
      inputProps.value = [] as any;
    }

    return React.createElement(component, {
      ...inputProps,
      children,
      ref,
      ...rest,
    });
  }

  if (!name) {
    throw new Error("prop name cannot be undefined in <Field> component");
  }

  return renderComponent(
    { children, component, ...rest, ...field },
    {},
    `Field(${name})`,
  );
}

// Create a properly typed forwardRef component that preserves generics
const Field = React.forwardRef(FieldComponent as any) as <
  FieldValue = any,
  T extends HTMLElement = HTMLElement,
  FormValues = Record<string, any>,
>(
  props: FieldProps<FieldValue, T, FormValues> & { ref?: React.Ref<T> },
) => React.ReactElement | null;

export default Field;
