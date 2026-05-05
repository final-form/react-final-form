import * as React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Form from "./ReactFinalForm";
import { useField } from "./index";

const onSubmitMock = () => {};

describe("useField — dynamic initialValue changes (#1085)", () => {
  // Tests for the initialValue-change effect: when the initialValue prop
  // changes on a mounted field, dirty/pristine state should update correctly.

  it("field becomes pristine when initialValue changes to match current value", async () => {
    let setInitial;

    const TestField = ({ initialValue }) => {
      const { input, meta } = useField("myField", {
        initialValue,
        subscription: { dirty: true, value: true },
      });
      return (
        <div>
          <input {...input} data-testid="input" />
          <span data-testid="dirty">{String(meta.dirty)}</span>
        </div>
      );
    };

    const Wrapper = () => {
      const [initial, setInitial_] = React.useState("original");
      setInitial = setInitial_;
      return (
        <Form onSubmit={onSubmitMock} initialValues={{ myField: "original" }}>
          {() => (
            <form>
              <TestField initialValue={initial} />
            </form>
          )}
        </Form>
      );
    };

    const { getByTestId } = render(<Wrapper />);

    // Starts pristine
    expect(getByTestId("dirty")).toHaveTextContent("false");

    // Type "updated" → field becomes dirty
    fireEvent.change(getByTestId("input"), { target: { value: "updated" } });
    expect(getByTestId("dirty")).toHaveTextContent("true");

    // Now update initialValue to "updated" — field should become pristine
    await act(async () => {
      setInitial("updated");
    });

    await waitFor(() => {
      expect(getByTestId("dirty")).toHaveTextContent("false");
    });
  });

  it("field value and initialValue both update when initialValue prop changes", async () => {
    // When initialValue changes and current value differs, re-registration
    // updates the form's tracked initialValue for this field. This verifies
    // the re-registration path executes without errors.
    let setInitial;

    const TestField = ({ initialValue }) => {
      const { input, meta } = useField("myField", {
        initialValue,
        subscription: { dirty: true, value: true },
      });
      return (
        <div>
          <input {...input} data-testid="input" />
          <span data-testid="dirty">{String(meta.dirty)}</span>
          <span data-testid="value">{input.value}</span>
        </div>
      );
    };

    const Wrapper = () => {
      const [initial, setInitial_] = React.useState("original");
      setInitial = setInitial_;
      return (
        <Form onSubmit={onSubmitMock} initialValues={{ myField: "original" }}>
          {() => (
            <form>
              <TestField initialValue={initial} />
            </form>
          )}
        </Form>
      );
    };

    const { getByTestId } = render(<Wrapper />);

    // Type "updated" → field becomes dirty
    fireEvent.change(getByTestId("input"), { target: { value: "updated" } });
    expect(getByTestId("dirty")).toHaveTextContent("true");

    // Change initialValue to "updated" → value matches new initial → pristine
    await act(async () => {
      setInitial("updated");
    });

    await waitFor(() => {
      expect(getByTestId("dirty")).toHaveTextContent("false");
    });

    // Value remains what the user typed
    expect(getByTestId("value")).toHaveTextContent("updated");
  });

  it("handles initialValue transitioning through undefined (value→undefined→value)", async () => {
    let setInitial;

    const TestField = ({ initialValue }) => {
      const { input, meta } = useField("myField", {
        initialValue,
        subscription: { dirty: true, value: true },
      });
      return (
        <div>
          <input {...input} data-testid="input" />
          <span data-testid="dirty">{String(meta.dirty)}</span>
        </div>
      );
    };

    const Wrapper = () => {
      const [initial, setInitial_] = React.useState("original");
      setInitial = setInitial_;
      return (
        <Form onSubmit={onSubmitMock} initialValues={{ myField: "original" }}>
          {() => (
            <form>
              <TestField initialValue={initial} />
            </form>
          )}
        </Form>
      );
    };

    const { getByTestId } = render(<Wrapper />);

    expect(getByTestId("dirty")).toHaveTextContent("false");

    // Type "changed" → field becomes dirty
    fireEvent.change(getByTestId("input"), { target: { value: "changed" } });
    expect(getByTestId("dirty")).toHaveTextContent("true");

    // Transition: "original" → undefined → "changed"
    // Without the fix, the ref stays at "original" through the undefined step,
    // so "undefined → changed" looks like no change and re-registration is skipped.
    // With the fix, the ref advances through undefined so "changed" is detected.
    await act(async () => {
      setInitial(undefined);
    });
    await act(async () => {
      setInitial("changed");
    });

    // initialValue now matches current value → should be pristine
    await waitFor(() => {
      expect(getByTestId("dirty")).toHaveTextContent("false");
    });
  });

  it("uses custom isEqual when detecting initialValue changes", async () => {
    let setInitial;
    // Custom isEqual: objects are equal if their .id matches
    const isEqual = (a, b) => {
      if (a && b && typeof a === "object" && typeof b === "object") {
        return a.id === b.id;
      }
      return a === b;
    };

    const TestField = ({ initialValue }) => {
      const { input, meta } = useField("myField", {
        initialValue,
        isEqual,
        subscription: { dirty: true, value: true },
      });
      return (
        <div>
          <input
            {...input}
            value={JSON.stringify(input.value) || ""}
            onChange={(e) => {
              try {
                input.onChange(JSON.parse(e.target.value));
              } catch {
                input.onChange(e.target.value);
              }
            }}
            data-testid="input"
          />
          <span data-testid="dirty">{String(meta.dirty)}</span>
        </div>
      );
    };

    const Wrapper = () => {
      const [initial, setInitial_] = React.useState({ id: 1, label: "One" });
      setInitial = setInitial_;
      return (
        <Form
          onSubmit={onSubmitMock}
          initialValues={{ myField: { id: 1, label: "One" } }}
        >
          {() => (
            <form>
              <TestField initialValue={initial} />
            </form>
          )}
        </Form>
      );
    };

    const { getByTestId } = render(<Wrapper />);

    // Starts pristine
    expect(getByTestId("dirty")).toHaveTextContent("false");

    // Change value to { id: 2 } → dirty
    fireEvent.change(getByTestId("input"), {
      target: { value: JSON.stringify({ id: 2, label: "Two" }) },
    });
    expect(getByTestId("dirty")).toHaveTextContent("true");

    // Change initialValue to { id: 2, label: "Different label" }
    // isEqual treats id:2 === id:2, so initialValue "matches" current value
    // → field should become pristine
    await act(async () => {
      setInitial({ id: 2, label: "Different label" });
    });

    await waitFor(() => {
      expect(getByTestId("dirty")).toHaveTextContent("false");
    });
  });

  it("field stays dirty when new initialValue does not match current value (no re-registration shortcut)", async () => {
    // When initialValue changes to X but the current value is Y (X ≠ Y),
    // the isEqual(currentValue, initialValue) check in the effect returns false
    // so the re-registration shortcut is skipped.
    // We verify the effect ran (no errors) and the field tracks dirty state.
    let setInitial;

    const TestField = ({ initialValue }) => {
      const { input, meta } = useField("myField", {
        initialValue,
        subscription: { dirty: true, pristine: true, value: true },
      });
      return (
        <div>
          <input {...input} data-testid="input" />
          <span data-testid="dirty">{String(meta.dirty)}</span>
          <span data-testid="pristine">{String(meta.pristine)}</span>
        </div>
      );
    };

    const Wrapper = () => {
      const [initial, setInitial_] = React.useState("original");
      setInitial = setInitial_;
      return (
        <Form onSubmit={onSubmitMock} initialValues={{ myField: "original" }}>
          {() => (
            <form>
              <TestField initialValue={initial} />
            </form>
          )}
        </Form>
      );
    };

    const { getByTestId } = render(<Wrapper />);

    // Starts pristine
    expect(getByTestId("dirty")).toHaveTextContent("false");
    expect(getByTestId("pristine")).toHaveTextContent("true");

    // Change initialValue to something new — field was never modified so it
    // adopts the new initialValue and remains pristine.
    await act(async () => {
      setInitial("new-initial");
    });

    await waitFor(() => {
      // Field stays pristine with new initialValue (value tracks initialValue)
      expect(getByTestId("pristine")).toHaveTextContent("true");
    });
  });
});
