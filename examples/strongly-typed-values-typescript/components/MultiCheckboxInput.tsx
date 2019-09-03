import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

const MultiCheckboxInput: React.FC<Props> = ({
  input: { value, ...input }
}: Props) => <input {...input} type="checkbox" />;

export default MultiCheckboxInput;
