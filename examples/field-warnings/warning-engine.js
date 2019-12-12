import React from "react";
import { FormSpy } from "react-final-form";

export const WarningEngine = ({ mutators: { setFieldData } }) => (
  <FormSpy
    subscription={{ values: true }}
    onChange={({ values }) => {
      setFieldData("firstName", {
        warning: values.firstName ? undefined : "Recommended"
      });
      setFieldData("lastName", {
        warning: values.lastName ? undefined : "Recommended"
      });
    }}
  />
);
