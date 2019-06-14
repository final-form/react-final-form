import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';

function FormText1({ input }: FieldRenderProps<string, HTMLInputElement>) {
  // renders OK because of the used generic
  return <input type="text" {...input} />;
}

function FormText2({ input }: FieldRenderProps<string, HTMLInputElement>) {
  // doesnt type check because we can't pass event handlers for `HTMLInputElement` to a <select/> component
  // $ExpectError
  return <select {...input} />;
}
