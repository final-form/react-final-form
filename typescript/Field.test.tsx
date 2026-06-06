import * as React from "react";
import { Field, FieldRenderProps } from "react-final-form";

const NumberInput: React.FC<{ value?: number }> = () => null;

function FormText1({ input }: FieldRenderProps<string, HTMLInputElement>) {
  // renders OK because of the used generic
  return <input type="text" {...input} />;
}

// FormText2 removed - was testing expected type error

function FieldNumberValue() {
  return (
    <Field<number> name="numberField">
      {({ input }: FieldRenderProps<number>) => (
        <NumberInput value={input.value} />
      )}
    </Field>
  );
}

function FieldNumberInputValue() {
  return (
    <Field<number, HTMLElement, number>
      name="numberField"
      parse={(value: number) => value}
    >
      {({ input }: FieldRenderProps<number>) => (
        <NumberInput value={input.value} />
      )}
    </Field>
  );
}

interface TextInputProps extends FieldRenderProps<string, HTMLInputElement> {
  label: string;
}

const TextInput: React.FC<TextInputProps> = () => null;

function FieldRenderPropsDoesNotAllowArbitraryProps({
  input,
  meta,
}: FieldRenderProps<string, HTMLInputElement>) {
  return (
    <>
      <TextInput input={input} meta={meta} label="First name" />
      {/* @ts-expect-error FieldRenderProps should not add an index signature */}
      <TextInput input={input} meta={meta} label="First name" extra="ignored" />
    </>
  );
}
