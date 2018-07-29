import React from "react";
import { Field, FormSpy } from "react-final-form";
import { propOr } from "ramda";

export default WrappedComponent => ({ name, ...props }) => (
  <FormSpy
    subscription={{}}
    render={({ form }) => (
      <Field
        name={name}
        subscription={{ data: true }}
        render={({ meta }) => (
          <WrappedComponent
            name={name}
            keyword={propOr(null, "keyword", meta.data)}
            updateKeyword={keyword =>
              form.mutators.setFieldData(name, { keyword })
            }
            {...props}
          />
        )}
      />
    )}
  />
);
