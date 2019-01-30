import * as React from 'react';
import {
  FormApi,
  Config,
  Decorator,
  FormState,
  FormSubscription,
  FieldSubscription
} from 'final-form';

export interface ReactContext {
  reactFinalForm: FormApi;
}

export interface FieldRenderProps<T extends HTMLElement> {
  input: {
    name: string;
    onBlur: (event?: React.FocusEvent<T>) => void;
    onChange: (event: React.ChangeEvent<T>) => void;
    onFocus: (event?: React.FocusEvent<T>) => void;
    value: any;
    checked?: boolean;
  };
  meta: Partial<{
    // TODO: Make a diff of `FieldState` without all the functions
    active: boolean;
    data: object;
    dirty: boolean;
    dirtySinceLastSubmit: boolean;
    error: any;
    initial: any;
    invalid: boolean;
    pristine: boolean;
    submitError: any;
    submitFailed: boolean;
    submitSucceeded: boolean;
    submitting: boolean;
    touched: boolean;
    valid: boolean;
    visited: boolean;
  }>;
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
  component?: React.ComponentType<T> | string;
  render?: (props: T) => React.ReactNode;
}

export interface FormProps extends Config, RenderableProps<FormRenderProps> {
  subscription?: FormSubscription;
  decorators?: Decorator[];
  initialValuesEqual?: (a?: object, b?: object) => boolean;
}

export interface FieldProps<T extends HTMLElement>
  extends RenderableProps<FieldRenderProps<T>> {
  allowNull?: boolean;
  format?: ((value: any, name: string) => any) | null;
  formatOnBlur?: boolean;
  parse?: ((value: any, name: string) => any) | null;
  name: string;
  isEqual?: (a: any, b: any) => boolean;
  subscription?: FieldSubscription;
  validate?: (value: any, allValues: object) => any;
  value?: any;
  [otherProp: string]: any;
}

export interface FormSpyProps extends RenderableProps<FormSpyRenderProps> {
  onChange?: (formState: FormState) => void;
  subscription?: FormSubscription;
}

export const Field: React.ComponentType<FieldProps<any>>;
export const Form: React.ComponentType<FormProps>;
export const FormSpy: React.ComponentType<FormSpyProps>;
export const version: string;

export function withReactFinalForm<T>(
  component: React.ComponentType<T>
): React.ComponentType<T & ReactContext>;
