import * as React from "react";
import { render, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "./ReactFinalForm";
import Field from "./Field";

const onSubmitMock = () => {};
const arrayInitialValues = { items: [{ name: "a" }, { name: "b" }] };
const nestedInitialValues = { parent: { child: { value: null } } };

describe("useField issue #1095", () => {
  it("does not overwrite a value set through change() when a field first mounts at that path", () => {
    let form;
    const { getByTestId, rerender } = render(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "A" }}>
        {(props) => {
          form = props.form;
          return null;
        }}
      </Form>,
    );

    act(() => form.change("foo", "B"));

    rerender(
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "A" }}>
        {() => <Field name="foo" component="input" data-testid="foo" />}
      </Form>,
    );

    expect(form.getState().values.foo).toBe("B");
    expect(getByTestId("foo").value).toBe("B");
  });

  it("does not overwrite a nested value set through a parent field (wizard case)", () => {
    let form;
    const Step = ({ showLeaf }) =>
      showLeaf ? (
        <Field name="parent.child.value" component="input" data-testid="leaf" />
      ) : (
        <Field name="parent" render={() => null} />
      );

    const ui = (showLeaf) => (
      <Form onSubmit={onSubmitMock} initialValues={nestedInitialValues}>
        {(props) => {
          form = props.form;
          return <Step showLeaf={showLeaf} />;
        }}
      </Form>
    );

    const { getByTestId, rerender } = render(ui(false));

    act(() => form.change("parent.child.value", "chosen"));

    rerender(ui(true));

    expect(form.getState().values.parent.child.value).toBe("chosen");
    expect(getByTestId("leaf").value).toBe("chosen");
  });

  it("preserves a changed value across unmount and remount of the field", () => {
    let form;
    const ui = (visible) => (
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "A" }}>
        {(props) => {
          form = props.form;
          return visible ? (
            <Field name="foo" component="input" data-testid="foo" />
          ) : null;
        }}
      </Form>
    );

    const { getByTestId, rerender } = render(ui(true));

    act(() => form.change("foo", "B"));
    rerender(ui(false));
    rerender(ui(true));

    expect(form.getState().values.foo).toBe("B");
    expect(getByTestId("foo").value).toBe("B");
  });

  it("still restores the initial value on remount when destroyOnUnregister is on (#1031)", () => {
    let form;
    const ui = (visible) => (
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ foo: "A" }}
        destroyOnUnregister
      >
        {(props) => {
          form = props.form;
          return visible ? (
            <Field name="foo" component="input" data-testid="foo" />
          ) : null;
        }}
      </Form>
    );

    const { getByTestId, rerender } = render(ui(true));

    act(() => form.change("foo", "B"));
    rerender(ui(false));

    // destroyOnUnregister deleted the value on unregister
    expect(form.getState().values.foo).toBeUndefined();

    rerender(ui(true));

    expect(form.getState().values.foo).toBe("A");
    expect(getByTestId("foo").value).toBe("A");
  });

  it("keeps initial values in StrictMode with destroyOnUnregister (#1031)", () => {
    const { getByTestId } = render(
      <React.StrictMode>
        <Form
          onSubmit={onSubmitMock}
          initialValues={{ foo: "A" }}
          destroyOnUnregister
        >
          {() => <Field name="foo" component="input" data-testid="foo" />}
        </Form>
      </React.StrictMode>,
    );

    expect(getByTestId("foo").value).toBe("A");
  });

  it("keeps a changed value in StrictMode without destroyOnUnregister", () => {
    let form;
    const ui = (visible) => (
      <React.StrictMode>
        <Form onSubmit={onSubmitMock} initialValues={{ foo: "A" }}>
          {(props) => {
            form = props.form;
            return visible ? (
              <Field name="foo" component="input" data-testid="foo" />
            ) : null;
          }}
        </Form>
      </React.StrictMode>
    );

    const { getByTestId, rerender } = render(ui(false));

    act(() => form.change("foo", "B"));
    rerender(ui(true));

    expect(form.getState().values.foo).toBe("B");
    expect(getByTestId("foo").value).toBe("B");
  });

  it("does not restore the initial value after an intentional change to undefined", () => {
    let form;
    const ui = (visible) => (
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "A" }}>
        {(props) => {
          form = props.form;
          return visible ? (
            <Field name="foo" component="input" data-testid="foo" />
          ) : null;
        }}
      </Form>
    );

    const { rerender } = render(ui(true));

    act(() => form.change("foo", undefined));
    rerender(ui(false));
    rerender(ui(true));

    expect(form.getState().values.foo).toBeUndefined();
  });

  it("preserves a value set before the first mount when destroyOnUnregister is on", () => {
    let form;
    const ui = (visible) => (
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ foo: "A" }}
        destroyOnUnregister
      >
        {(props) => {
          form = props.form;
          return visible ? (
            <Field name="foo" component="input" data-testid="foo" />
          ) : null;
        }}
      </Form>
    );

    const { getByTestId, rerender } = render(ui(false));

    act(() => form.change("foo", "programmatic"));
    rerender(ui(true));

    expect(form.getState().values.foo).toBe("programmatic");
    expect(getByTestId("foo").value).toBe("programmatic");
  });

  it("does not restore a stale array entry after the list shifted", () => {
    let form;
    const ui = (len) => (
      <Form onSubmit={onSubmitMock} initialValues={arrayInitialValues}>
        {(props) => {
          form = props.form;
          return Array.from({ length: len }).map((_, i) => (
            <Field key={i} name={`items[${i}].name`} component="input" />
          ));
        }}
      </Form>
    );

    const { rerender } = render(ui(2));

    // what final-form-arrays remove(1) + push(undefined) leaves behind
    act(() => form.change("items", [{ name: "a" }]));
    rerender(ui(1));
    act(() => form.change("items", [{ name: "a" }, undefined]));
    rerender(ui(2));

    expect(form.getState().values.items[1]).toBeUndefined();
  });

  it("keeps a typed value when an unrelated prop changes", () => {
    let form;
    const ui = (data) => (
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "original" }}>
        {(props) => {
          form = props.form;
          return <Field name="foo" component="input" data={data} />;
        }}
      </Form>
    );

    const { rerender } = render(ui({ tick: 1 }));

    act(() => form.change("foo", "typed-by-user"));
    rerender(ui({ tick: 2 }));

    expect(form.getState().values.foo).toBe("typed-by-user");
  });

  it("does not overwrite a modified field when a non-matching initialValue arrives", () => {
    let form;
    const ui = (initialValue) => (
      <Form onSubmit={onSubmitMock} initialValues={{ foo: "original" }}>
        {(props) => {
          form = props.form;
          return (
            <Field name="foo" component="input" initialValue={initialValue} />
          );
        }}
      </Form>
    );

    const { rerender } = render(ui("original"));

    act(() => form.change("foo", "typed-by-user"));
    rerender(ui("server-said-B"));

    expect(form.getState().values.foo).toBe("typed-by-user");
  });

  it("still reapplies a field-level initialValue after destroyOnUnregister wipes it", () => {
    const ui = (visible) => (
      <Form onSubmit={onSubmitMock} destroyOnUnregister>
        {() =>
          visible ? (
            <Field
              name="nickname"
              component="input"
              initialValue="erik"
              data-testid="nickname"
            />
          ) : null
        }
      </Form>
    );

    const { getByTestId, rerender } = render(ui(true));

    rerender(ui(false));
    rerender(ui(true));

    expect(getByTestId("nickname").value).toBe("erik");
  });

  it("still seeds a path that has no value at all", () => {
    let form;
    const ui = (visible) => (
      <Form onSubmit={onSubmitMock} destroyOnUnregister>
        {(props) => {
          form = props.form;
          return visible ? (
            <Field
              name="late"
              component="input"
              initialValue="seeded"
              data-testid="late"
            />
          ) : null;
        }}
      </Form>
    );

    const { getByTestId, rerender } = render(ui(false));
    expect(form.getState().values.late).toBeUndefined();

    rerender(ui(true));

    expect(getByTestId("late").value).toBe("seeded");
    expect(form.getState().values.late).toBe("seeded");
  });
});
