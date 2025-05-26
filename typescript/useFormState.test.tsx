import { useFormState } from "react-final-form";
import { FormState } from "final-form";

const submittingToLabel = (submitting: boolean) => (submitting ? "Yes" : "No");

function Comp1() {
  const { submitting } = useFormState();
  return submittingToLabel(submitting || false);
}

function MyComponent() {
  const formState: FormState = useFormState();
  return null;
}

function MyTypedComponent() {
  const formState: FormState<{ name: string }> = useFormState<{
    name: string;
  }>();
  return null;
}
