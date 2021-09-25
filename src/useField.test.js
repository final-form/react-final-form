// @flow

import * as React from "react";
import { render, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ErrorBoundary } from "./testUtils";
import Form from "./ReactFinalForm";
import Field from "./Field";
import { useField } from "./index";
import { act } from "react-dom/test-utils";

const onSubmitMock = (values) => {};

describe("useField", () => {
  afterEach(cleanup);

  // Most of the functionality of useField is tested in Field.test.js
  // This file is only for testing its use as a hook in other components

  it("should warn if not used inside a form", () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const errorSpy = jest.fn();
    const MyFieldComponent = () => {
      useField("name");
      return <div />;
    };
    render(
      <ErrorBoundary spy={errorSpy}>
        <MyFieldComponent />
      </ErrorBoundary>,
    );
    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy.mock.calls[0][0].message).toBe(
      "useField must be used inside of a <Form> component",
    );
    console.error.mockRestore();
  });

  it("should subscribe to all by default", () => {
    const MyFieldListener = () => {
      const { input, meta } = useField("name");
      expect(meta.active).toBe(false);
      expect(meta.data).toEqual({});
      expect(meta.dirty).toBe(false);
      expect(meta.dirtySinceLastSubmit).toBe(false);
      expect(meta.error).toBeUndefined();
      expect(meta.initial).toBeUndefined();
      expect(meta.invalid).toBe(false);
      expect(meta.length).toBeUndefined();
      expect(meta.modified).toBe(false);
      expect(meta.modifiedSinceLastSubmit).toBe(false);
      expect(meta.pristine).toBe(true);
      expect(meta.submitError).toBeUndefined();
      expect(meta.submitFailed).toBe(false);
      expect(meta.submitSucceeded).toBe(false);
      expect(meta.submitting).toBe(false);
      expect(meta.touched).toBe(false);
      expect(meta.valid).toBe(true);
      expect(meta.validating).toBe(false);
      expect(meta.visited).toBe(false);
      expect(input.value).toBe("");
      return null;
    };
    render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <MyFieldListener />
          </form>
        )}
      </Form>,
    );
  });

  it("should track field state", () => {
    const spy = jest.fn();
    const MyFieldListener = () => {
      spy(useField("name").input.value);
      return null;
    };
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <MyFieldListener />
          </form>
        )}
      </Form>,
    );
    expect(getByTestId("name").value).toBe("");
    // All forms without restricted subscriptions render twice at first because they
    // need to update their validation and touched/modified/visited maps every time
    // new fields are registered.
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0]).toBe("");
    expect(spy.mock.calls[1][0]).toBe("");
    fireEvent.change(getByTestId("name"), { target: { value: "erikras" } });
    expect(getByTestId("name").value).toBe("erikras");
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[2][0]).toBe("erikras");
  });

  it("should allow for creation of render-controlled components", () => {
    const spy = jest.fn();
    const MemoizedDirtyDisplay = React.memo(({ dirty }) => {
      spy(dirty);
      return <div data-testid="dirty">{dirty ? "Dirty" : "Pristine"}</div>;
    });
    const MyFieldListener = () => {
      const field = useField("name", { subscription: { dirty: true } });
      return <MemoizedDirtyDisplay dirty={field.meta.dirty} />;
    };
    const { getByTestId } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <Field name="name" component="input" data-testid="name" />
            <MyFieldListener />
          </form>
        )}
      </Form>,
    );
    expect(getByTestId("name").value).toBe("");
    expect(getByTestId("dirty")).toHaveTextContent("Pristine");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBe(false);
    // simulate typing
    fireEvent.change(getByTestId("name"), { target: { value: "e" } });
    expect(getByTestId("dirty")).toHaveTextContent("Dirty");
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(true);
    fireEvent.change(getByTestId("name"), { target: { value: "er" } });
    fireEvent.change(getByTestId("name"), { target: { value: "eri" } });
    fireEvent.change(getByTestId("name"), { target: { value: "erik" } });
    fireEvent.change(getByTestId("name"), { target: { value: "erikr" } });
    fireEvent.change(getByTestId("name"), { target: { value: "erikra" } });
    fireEvent.change(getByTestId("name"), { target: { value: "erikras" } });
    // dirty flag hasn't changed since the first character
    expect(spy).toHaveBeenCalledTimes(2);
    // make pristine again
    fireEvent.change(getByTestId("name"), { target: { value: "" } });
    expect(getByTestId("dirty")).toHaveTextContent("Pristine");
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[2][0]).toBe(false);
  });

  it("should give same instance of handlers as value changes", () => {
    const spy = jest.fn();
    const MyField = ({ name }) => {
      const { input } = useField(name, { subscription: { value: true } });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    const [onChange, onFocus, onBlur] = spy.mock.calls[0];
    const setValue = (value) => {
      act(() => {
        onFocus();
        onChange(value);
        onBlur();
      });
    };

    setValue("dog");
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur

    setValue("cat");
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });

  it("should give same instance of handlers as name changes", () => {
    const spy = jest.fn();
    const MyField = ({ name }) => {
      const { input } = useField(name, { subscription: { value: true } });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    const { rerender } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    rerender(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="dog" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });

  it("should give same instance of handlers as type changes", () => {
    const spy = jest.fn();
    const MyField = ({ name, type }) => {
      const { input } = useField(name, { subscription: { value: true }, type });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    const { rerender } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    rerender(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="dog" type="search" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });

  it("should give same instance of handlers as formatOnBlur changes", () => {
    const spy = jest.fn();
    const MyField = ({ name, formatOnBlur }) => {
      const { input } = useField(name, {
        subscription: { value: true },
        formatOnBlur,
      });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    const { rerender } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    rerender(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="dog" formatOnBlur />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });

  it("should give same instance of handlers as parse changes", () => {
    const spy = jest.fn();
    const MyField = ({ name, parse }) => {
      const { input } = useField(name, {
        subscription: { value: true },
        parse,
      });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    const { rerender } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    rerender(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="dog" parse={(x) => x} />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });

  it("should give same instance of handlers as format changes", () => {
    const spy = jest.fn();
    const MyField = ({ name, format }) => {
      const { input } = useField(name, {
        subscription: { value: true },
        format,
      });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    const { rerender } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    rerender(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="dog" format={(x) => x} />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });

  it("should give same instance of handlers as component changes", () => {
    const spy = jest.fn();
    const MyField = ({ name, component }) => {
      const { input } = useField(name, {
        subscription: { value: true },
        component,
      });
      const { onChange, onFocus, onBlur } = input;
      spy(onChange, onFocus, onBlur);
      return <input {...input} />;
    };
    const { rerender } = render(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="myField" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[1][0]).toBe(spy.mock.calls[0][0]); // onChange
    expect(spy.mock.calls[1][1]).toBe(spy.mock.calls[0][1]); // onFocus
    expect(spy.mock.calls[1][2]).toBe(spy.mock.calls[0][2]); // onBlur

    rerender(
      <Form onSubmit={onSubmitMock}>
        {() => (
          <form>
            <MyField name="dog" component="select" />
          </form>
        )}
      </Form>,
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy.mock.calls[2][0]).toBe(spy.mock.calls[1][0]); // onChange
    expect(spy.mock.calls[2][1]).toBe(spy.mock.calls[1][1]); // onFocus
    expect(spy.mock.calls[2][2]).toBe(spy.mock.calls[1][2]); // onBlur
    expect(spy.mock.calls[3][0]).toBe(spy.mock.calls[2][0]); // onChange
    expect(spy.mock.calls[3][1]).toBe(spy.mock.calls[2][1]); // onFocus
    expect(spy.mock.calls[3][2]).toBe(spy.mock.calls[2][2]); // onBlur
  });
});
