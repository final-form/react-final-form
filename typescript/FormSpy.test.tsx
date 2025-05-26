import * as React from "react";
import { FormSpy, FormSpyRenderProps } from "react-final-form";

function submitButtonSpy() {
  return (
    <FormSpy subscription={{ pristine: true, submitting: true, valid: true }}>
      {({ pristine, submitting, valid }: FormSpyRenderProps) => {
        return (
          <button type="submit" disabled={submitting || pristine || !valid}>
            Submit
          </button>
        );
      }}
    </FormSpy>
  );
}
