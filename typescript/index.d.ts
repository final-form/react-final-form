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

type SupportedInputs = 'input' | 'select' | 'textarea';

export interface ReactContext {
  reactFinalForm: FormApi;
}

export type FieldPlainState = Pick<
  FieldState,
  Exclude<keyof FieldState, 'blur' | 'change' | 'focus'>
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
  meta: FieldPlainState;
}

export interface SubsetFormApi {
  batch: (fn: () => void) => void;
  blur: (name: string) => void;
  change: (name: string, value: any) => void;
  focus: (name: string) => void;
  initialize: (values: object) => void;
  mutators: { [key: string]: (...args: any[]) => any };
  reset: () => void;
}

export interface FormRenderProps extends FormState, SubsetFormApi {
  batch: (fn: () => void) => void;
  form: FormApi;
  handleSubmit: (
    event?: React.SyntheticEvent<HTMLFormElement>
  ) => Promise<object | undefined> | undefined;
}

export interface FormSpyRenderProps extends FormState, SubsetFormApi {
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
  allowNull?: boolean;
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

export const Field: React.ComponentType<FieldProps<any>>;
export const Form: React.ComponentType<FormProps>;
export const FormSpy: React.ComponentType<FormSpyProps>;
export function useField<T extends HTMLElement>(
  name: string,
  config: UseFieldConfig
): FieldRenderProps<T>;
export function useForm(): FormApi;
export function useFormState(params: UseFormStateParams): FormState | void;
export const version: string;
