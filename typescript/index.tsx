import * as React from 'react';
import { Form } from 'react-final-form';

const noop = () => {};
// missing required props
const C1 = () => {
  // $ExpectError
  return <Form />;
};

// provided required props
const C2 = () => <Form onSubmit={noop} />;
