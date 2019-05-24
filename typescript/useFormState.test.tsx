import * as React from 'react';
import { useFormState } from 'react-final-form';

const submittingToLabel = (submitting: boolean) => (submitting ? 'Yes' : 'No');

function Comp1() {
  const { submitting } = useFormState();
  return submittingToLabel(submitting);
}
