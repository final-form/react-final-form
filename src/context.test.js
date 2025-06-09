import * as React from "react";
import { render } from "@testing-library/react";
import FormContext from "./context";
import ReactFinalForm from "./ReactFinalForm";

describe("FormContext", () => {
  it("should provide form context to children", () => {
    const spy = jest.fn();
    const TestComponent = () => {
      const form = React.useContext(FormContext);
      spy(form);
      return null;
    };

    render(
      <ReactFinalForm onSubmit={() => {}}>
        {({ form }) => (
          <FormContext.Provider value={form}>
            <TestComponent />
          </FormContext.Provider>
        )}
      </ReactFinalForm>,
    );

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBeDefined();
    expect(typeof spy.mock.calls[0][0].registerField).toBe("function");
  });

  it("should have undefined as default value", () => {
    const spy = jest.fn();
    const TestComponent = () => {
      const form = React.useContext(FormContext);
      spy(form);
      return null;
    };

    render(<TestComponent />);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toBeUndefined();
  });
});
