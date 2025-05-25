import * as React from "react";
import Form from "./ReactFinalForm";
import FormSpy from "./FormSpy";
export { default as Field } from "./Field";
export { default as Form, version } from "./ReactFinalForm";
export { default as FormSpy } from "./FormSpy";
export { default as useField } from "./useField";
export { default as useFormState } from "./useFormState";
export { default as useForm } from "./useForm";
export function withTypes<FormValues = Record<string, any>>() {
  return {
    Form: Form as React.ComponentType<import("./types").FormProps<FormValues>>,
    FormSpy: FormSpy as React.ComponentType<
      import("./types").FormSpyProps<FormValues>
    >,
  };
}

export * from "./types";
