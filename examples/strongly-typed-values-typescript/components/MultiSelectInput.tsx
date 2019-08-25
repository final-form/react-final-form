import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string[], any>;

const MultiSelectInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => (
  <select {...input} {...rest} multiple value={input.value || []} />
);

export default MultiSelectInput;
