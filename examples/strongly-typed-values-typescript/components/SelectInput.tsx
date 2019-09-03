import React from "react";
import { FieldRenderProps } from "react-final-form";

type Props = FieldRenderProps<string, any>;

const SelectInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => (
  <select {...input} {...rest} />
);

export default SelectInput;
