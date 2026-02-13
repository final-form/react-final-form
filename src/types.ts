import * as React from "react";
import type {
  FormApi,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldSubscription,
  FieldValidator,
} from "final-form";

type SupportedInputs = "input" | "select" | "textarea";

// Backward compatibility: Re-export AnyObject type
export type AnyObject = Record<string, any>;

export interface ReactContext<FormValues = Record<string, any>> {
  reactFinalForm: FormApi<FormValues>;
}

export interface FieldInputProps<FieldValue = any, T = any> {
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  value: FieldValue;
  checked?: boolean;
  multiple?: boolean;
  type?: string;
}

export interface FieldRenderProps<
  FieldValue = any,
  T = any,
  _FormValues = any,
> {
  input: FieldInputProps<FieldValue, T>;
  meta: {
    active?: boolean;
    data?: Record<string, any>;
    dirty?: boolean;
    dirtySinceLastSubmit?: boolean;
    error?: any;
    initial?: any;
    invalid?: boolean;
    length?: number;
    modified?: boolean;
    modifiedSinceLastSubmit?: boolean;
    pristine?: boolean;
    submitError?: any;
    submitFailed?: boolean;
    submitSucceeded?: boolean;
    submitting?: boolean;
    touched?: boolean;
    valid?: boolean;
    validating?: boolean;
    visited?: boolean;
  };
}

// Backward compatibility: Export FieldMetaState type
export type FieldMetaState<FieldValue = any> =
  FieldRenderProps<FieldValue>["meta"];

export interface SubmitEvent {
  preventDefault?: () => void;
  stopPropagation?: () => void;
}

export interface FormRenderProps<FormValues = Record<string, any>>
  extends FormState<FormValues> {
  handleSubmit: (
    event?: SubmitEvent,
  ) => Promise<Record<string, any> | undefined> | undefined;
  form: FormApi<FormValues>;
}

export interface FormSpyRenderProps<FormValues = Record<string, any>>
  extends FormState<FormValues> {
  form: FormApi<FormValues>;
}

export interface RenderableProps<T> {
  component?: React.ComponentType<any> | SupportedInputs;
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  render?: (props: T) => React.ReactNode;
}

export interface FormProps<FormValues = Record<string, any>>
  extends Config<FormValues>,
    RenderableProps<FormRenderProps<FormValues>> {
  subscription?: FormSubscription;
  decorators?: Decorator<FormValues>[];
  form?: FormApi<FormValues>;
  initialValuesEqual?: (
    a?: Record<string, any>,
    b?: Record<string, any>,
  ) => boolean;
  __versions?: Record<string, string>;
}

export interface UseFieldAutoConfig {
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | false;
  component?: RenderableProps<any>["component"];
  data?: Record<string, any>;
  defaultValue?: any;
  format?: (value: any, name: string) => any;
  formatOnBlur?: boolean;
  initialValue?: any;
  isEqual?: (a: any, b: any) => boolean;
  multiple?: boolean;
  parse?: (value: any, name: string) => any;
  type?: string;
  validate?: FieldValidator<any>;
  validateFields?: string[];
  value?: any;
}

export interface UseFieldConfig extends UseFieldAutoConfig {
  subscription?: FieldSubscription;
}

export interface FieldProps<
  FieldValue = any,
  T = any,
  _FormValues = Record<string, any>,
> extends UseFieldConfig,
    Omit<RenderableProps<FieldRenderProps<FieldValue, T>>, "children"> {
  name: string;
  children?: RenderableProps<FieldRenderProps<FieldValue, T>>["children"];
  [key: string]: any; // Allow additional props for HTML elements
}

export interface UseFormStateParams<FormValues = Record<string, any>> {
  onChange?: (formState: FormState<FormValues>) => void;
  subscription?: FormSubscription;
}

export interface FormSpyProps<FormValues = Record<string, any>>
  extends UseFormStateParams<FormValues>,
    RenderableProps<FormSpyRenderProps<FormValues>> {}

export interface FormSpyPropsWithForm<FormValues = Record<string, any>>
  extends FormSpyProps<FormValues> {
  reactFinalForm: FormApi<FormValues>;
}
