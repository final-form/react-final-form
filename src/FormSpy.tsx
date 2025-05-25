import renderComponent from "./renderComponent";
import type { FormSpyProps, FormSpyRenderProps } from "./types";
import isSyntheticEvent from "./isSyntheticEvent";
import useForm from "./useForm";
import useFormState from "./useFormState";

function FormSpy<FormValues = Record<string, any>>({
  onChange,
  subscription,
  ...rest
}: FormSpyProps<FormValues>): React.ReactElement | null {
  const reactFinalForm = useForm<FormValues>("FormSpy");
  const state = useFormState({ onChange, subscription });
  if (onChange) {
    return null;
  }

  const renderProps: FormSpyRenderProps<FormValues> = {
    ...state,
    form: {
      ...reactFinalForm,
      reset: (eventOrValues?: any) => {
        if (isSyntheticEvent(eventOrValues)) {
          // it's a React SyntheticEvent, call reset with no arguments
          reactFinalForm.reset();
        } else {
          reactFinalForm.reset(eventOrValues);
        }
      },
    },
  } as FormSpyRenderProps<FormValues>;
  return renderComponent(
    {
      ...rest,
      ...renderProps,
    },
    state,
    "FormSpy",
  ) as React.ReactElement;
}

export default FormSpy;
