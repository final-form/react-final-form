import * as React from "react";
import type { FormApi } from "final-form";
import ReactFinalFormContext from "./context";

function useForm<FormValues = Record<string, any>>(
  componentName?: string,
): FormApi<FormValues> {
  const form: FormApi<FormValues> | undefined = React.useContext(
    ReactFinalFormContext,
  );
  if (!form) {
    throw new Error(
      `${componentName || "useForm"} must be used inside of a <Form> component`,
    );
  }
  return form;
}

export default useForm;
