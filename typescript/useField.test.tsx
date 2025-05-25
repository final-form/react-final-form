import * as React from "react";
import { useField, FieldRenderProps } from "react-final-form";

const NumberInput: React.FC<{ value?: number }> = () => null;

function NumberFieldValue() {
  const { input } = useField<number>("numberField");
  return <NumberInput value={input.value} />;
}

function NumberInputValue() {
  const { input } = useField("numberField", {
    format: (value: string) => Number(value),
    parse: (value: number) => String(value),
  });
  return <NumberInput value={input.value} />;
}

function MyComponent() {
  const field: FieldRenderProps = useField("myField");
  return <input {...field.input} />;
}

function MyTypedComponent() {
  const field: FieldRenderProps<string> = useField<string>("myField");
  return <input {...field.input} />;
}

function MyTypedComponentWithElement() {
  const field: FieldRenderProps<string, HTMLInputElement> = useField<
    string,
    HTMLInputElement
  >("myField");
  return <input {...field.input} />;
}
