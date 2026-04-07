import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "./ReactFinalForm";
import { useField } from "./index";

const onSubmitMock = (_values) => {};

describe("useField issue #984", () => {
  afterEach(cleanup);

  // https://github.com/final-form/react-final-form/issues/984
  // When a parent component's useEffect changes a form value,
  // sibling components' useField should receive the updated value.
  it("should get newest value when sibling updates form in useEffect", async () => {
    const Field1 = () => {
      const { input } = useField("field1");
      return <input {...input} data-testid="field1" />;
    };

    const Field2 = () => {
      const { input } = useField("field1", { subscription: { value: true } });
      // Should show "UpdatedByField1" after ParentWithEffect's useEffect runs
      return <span data-testid="field1-value">{input.value}</span>;
    };

    const ParentWithEffect = () => {
      const { input } = useField("field1");
      React.useEffect(() => {
        // Simulate programmatic change during effect phase
        input.onChange("UpdatedByField1");
      }, []);
      return null;
    };

    const { getByTestId } = render(
      <Form
        onSubmit={onSubmitMock}
        initialValues={{ field1: "InitialField1" }}
      >
        {() => (
          <form>
            <ParentWithEffect />
            <Field1 />
            <Field2 />
          </form>
        )}
      </Form>
    );

    // After useEffect runs, Field2 should see the updated value
    // This is the bug: Field2 sees stale "InitialField1" instead
    await (async () => {
      // Wait a bit for effects to settle
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(getByTestId("field1-value").textContent).toBe("UpdatedByField1");
    })();
  });
});
