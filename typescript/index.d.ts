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

export interface ReactContext {
  reactFinalForm: FormApi;
}

export type FieldMetaState = Omit<
  FieldState,
  'blur' | 'change' | 'focus' | 'name' | 'value'
>;

interface FieldInputProps<T extends HTMLElement> {
  name: string;
  onBlur: (event?: React.FocusEvent<T>) => void;
  onChange: (event: React.ChangeEvent<T> | any) => void;
  onFocus: (event?: React.FocusEvent<T>) => void;
  type?: string;
  value: any;
  checked?: boolean;
  multiple?: boolean;
}

export interface FieldRenderProps<T extends HTMLElement> {
  input: FieldInputProps<T>;
  meta: FieldMetaState;
}

export interface FormRenderProps extends FormState {
  form: FormApi;
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<object | undefined> | undefined;
}

export interface FormSpyRenderProps extends FormState {
  form: FormApi;
}

export interface RenderableProps<T> {
  children?: ((props: T) => React.ReactNode) | React.ReactNode;
  component?: React.ComponentType<T> | SupportedInputs;
  render?: (props: T) => React.ReactNode;
}

export interface FormProps extends Config, RenderableProps<FormRenderProps> {
  subscription?: FormSubscription;
  decorators?: Decorator[];
  initialValuesEqual?: (a?: object, b?: object) => boolean;
}

export interface UseFieldConfig {
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | boolean;
  defaultValue?: any;
  format?: ((value: any, name: string) => any) | null;
  formatOnBlur?: boolean;
  initialValue?: any;
  isEqual?: (a: any, b: any) => boolean;
  multiple?: boolean;
  parse?: ((value: any, name: string) => any) | null;
  subscription?: FieldSubscription;
  type?: string;
  validate?: FieldValidator;
  validateFields?: string[];
  value?: any;
}

export interface FieldProps<T extends HTMLElement>
  extends UseFieldConfig,
    RenderableProps<FieldRenderProps<T>> {
  name: string;
  [otherProp: string]: any;
}

export interface UseFormStateParams {
  onChange?: (formState: FormState) => void;
  subscription?: FormSubscription;
}

export interface FormSpyProps
  extends UseFormStateParams,
    RenderableProps<FormSpyRenderProps> {}

export const Field: React.FC<FieldProps<any>>;
export const Form: React.FC<FormProps>;
export const FormSpy: React.FC<FormSpyProps>;
export function useField<T extends HTMLElement>(
  name: string,
  config: UseFieldConfig
): FieldRenderProps<T>;
export function useForm(componentName?: string): FormApi;
export function useFormState(params?: UseFormStateParams): FormState;
export const version: string;
