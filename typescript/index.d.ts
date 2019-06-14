import * as React from 'react';
import {
  FormApi,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldState,
  FieldSubscription,
  FieldValidator
} from 'final-form';
import { Omit } from 'ts-essentials';

type SupportedInputs = 'input' | 'select' | 'textarea';

export interface ReactContext<FormValues> {
  reactFinalForm: FormApi<FormValues>;
}

export type FieldMetaState<FieldValue> = Omit<
  FieldState<FieldValue>,
  'blur' | 'change' | 'focus' | 'name' | 'value'
>;

interface FieldInputProps<FieldValue, T extends HTMLElement> {
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: FieldValue;
  checked?: boolean;
  multiple?: boolean;
}

interface AnyObject {
  [key: string]: any;
}

export interface FieldRenderProps<FieldValue, T extends HTMLElement> {
  input: FieldInputProps<FieldValue, T>;
  meta: FieldMetaState<FieldValue>;
}

export interface FormRenderProps<FormValues = AnyObject>
  extends FormState<FormValues> {
  form: FormApi<FormValues>;
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<AnyObject | undefined> | undefined;
}

export interface FormSpyRenderProps<FormValues = AnyObject>
  extends FormState<FormValues> {
  form: FormApi<FormValues>;
}

export interface RenderableProps<T> {
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  component?: React.ComponentType<T> | SupportedInputs;
  render?: (props: T) => React.ReactNode;
}

export interface FormProps<FormValues = AnyObject>
  extends Config<FormValues>,
    RenderableProps<FormRenderProps<FormValues>> {
  subscription?: FormSubscription;
  decorators?: Decorator[];
  form?: FormApi<FormValues>;
  initialValuesEqual?: (a?: AnyObject, b?: AnyObject) => boolean;
}

export interface UseFieldConfig<FieldValue> {
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | boolean;
  defaultValue?: FieldValue;
  format?: (value: FieldValue, name: string) => any;
  formatOnBlur?: boolean;
  initialValue?: FieldValue;
  isEqual?: (a: any, b: any) => boolean;
  multiple?: boolean;
  parse?: (value: any, name: string) => FieldValue;
  subscription?: FieldSubscription;
  type?: string;
  validate?: FieldValidator<FieldValue>;
  validateFields?: string[];
  value?: FieldValue;
}

export interface FieldProps<FieldValue, T extends HTMLElement>
  extends UseFieldConfig<FieldValue>,
    RenderableProps<FieldRenderProps<FieldValue, T>> {
  name: string;
  [otherProp: string]: any;
}

export interface UseFormStateParams<FormValues = AnyObject> {
  onChange?: (formState: FormState<FormValues>) => void;
  subscription?: FormSubscription;
}

export interface FormSpyProps<FormValues = AnyObject>
  extends UseFormStateParams<FormValues>,
    RenderableProps<FormSpyRenderProps<FormValues>> {}

export const Field: <FieldValue = any, T extends HTMLElement = HTMLElement>(
  props: FieldProps<FieldValue, T>
) => React.ReactElement;
export const Form: <FormValues = AnyObject>(
  props: FormProps<FormValues>
) => React.ReactElement;
export const FormSpy: <FormValues = AnyObject>(
  props: FormSpyProps<FormValues>
) => React.ReactElement;
export function useField<FieldValue = any, T extends HTMLElement = HTMLElement>(
  name: string,
  config?: UseFieldConfig<FieldValue>
): FieldRenderProps<FieldValue, T>;
export function useForm<FormValues = AnyObject>(
  componentName?: string
): FormApi<FormValues>;
export function useFormState<FormValues = AnyObject>(
  params?: UseFormStateParams
): FormState<FormValues>;
export function withTypes<FormValues>(): {
  Form: React.FC<FormProps<FormValues>>;
  FormSpy: React.FC<FormSpyProps<FormValues>>;
};
export const version: string;
