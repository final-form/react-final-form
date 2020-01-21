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

export interface ReactContext<FormValues> {
  reactFinalForm: FormApi<FormValues>;
}

export type FieldMetaState<FieldValue> = Pick<
  FieldState<FieldValue>,
  Exclude<
    keyof FieldState<FieldValue>,
    'blur' | 'change' | 'focus' | 'name' | 'value'
  >
>;

interface FieldInputProps<FieldValue, T extends HTMLElement = HTMLElement>
  extends AnyObject {
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

export interface FieldRenderProps<
  FieldValue,
  T extends HTMLElement = HTMLElement
> {
  input: FieldInputProps<FieldValue, T>;
  meta: FieldMetaState<FieldValue>;
  [otherProp: string]: any;
}

export interface FormRenderProps<FormValues = AnyObject>
  extends FormState<FormValues>,
    RenderableProps<FormRenderProps<FormValues>> {
  form: FormApi<FormValues>;
  handleSubmit: (
    event?: Partial<
      Pick<React.SyntheticEvent, 'preventDefault' | 'stopPropagation'>
    >
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
  decorators?: Array<Decorator<FormValues>>;
  form?: FormApi<FormValues>;
  initialValuesEqual?: (a?: AnyObject, b?: AnyObject) => boolean;
}

export interface UseFieldConfig<FieldValue> {
  afterSubmit?: () => void;
  allowNull?: boolean;
  beforeSubmit?: () => void | boolean;
  data?: AnyObject;
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

export interface FieldProps<
  FieldValue,
  RP extends FieldRenderProps<FieldValue, T>,
  T extends HTMLElement = HTMLElement
> extends UseFieldConfig<FieldValue>, RenderableProps<RP> {
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

export const Field: <
  FieldValue = any,
  RP extends FieldRenderProps<FieldValue, T> = FieldRenderProps<
    FieldValue,
    HTMLElement
  >,
  T extends HTMLElement = HTMLElement
>(
  props: FieldProps<FieldValue, RP, T>
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
