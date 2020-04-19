import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

const TextAreaInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => (
  <textarea {...input} {...rest} />
);

export default TextAreaInput;
