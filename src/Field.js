// @flow
import * as React from "react";
import type { FieldProps as Props, FieldRenderProps } from "./types";
import renderComponent from "./renderComponent";
import useField from "./useField";

const Field = React.forwardRef<any, Props>(function Field(
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
  }: Props,
  ref,
) {
  const field: FieldRenderProps = useField(name, {
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
    parse,
    subscription,
    type,
    validate,
    validateFields,
    value,
  });

  if (typeof children === "function") {
    return (children: Function)({ ...field, ...rest });
  }

  if (typeof component === "string") {
    // ignore meta, combine input with any other props
    return React.createElement(component, {
      ...field.input,
      children,
      ref,
      ...rest,
    });
  }

  if (!name) {
    throw new Error("prop name cannot be undefined in <Field> component");
  }

  return renderComponent(
    { children, component, ref, ...rest },
    field,
    `Field(${name})`,
  );
});

export default Field;
