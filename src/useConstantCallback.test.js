// @flow

import * as React from "react";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import useConstantCallback from "./useConstantCallback";

describe("useConstantCallback", () => {
  afterEach(cleanup);

  it("should give the same instance on every render, even as params/deps change", () => {
    const callback = jest.fn();
    const MyComponent = () => {
      const [name, setName] = React.useState("John");
      const [age, setAge] = React.useState(20);
      const [isAdmin, setAdmin] = React.useState(false);
      const constantCallback = useConstantCallback((time) => {
        expect(typeof time).toBe("number");
        callback(name, age, isAdmin);
      });
      const callbackRef = React.useRef(constantCallback);
      expect(callbackRef.current).toBe(constantCallback);
      return (
        <div>
          <button
            data-testid="call"
            onClick={() => constantCallback(Date.now())}
          >
            Call
          </button>
          <button data-testid="changeName" onClick={() => setName("Paul")}>
            {name}
          </button>
          <button data-testid="changeAge" onClick={() => setAge(25)}>
            {age}
          </button>
          <button data-testid="changeAdmin" onClick={() => setAdmin(true)}>
            {isAdmin ? "Yes" : "No"}
          </button>
        </div>
      );
    };
    const { getByTestId } = render(<MyComponent />);
    const call = getByTestId("call");
    const changeName = getByTestId("changeName");
    const changeAge = getByTestId("changeAge");
    const changeAdmin = getByTestId("changeAdmin");

    expect(changeName).toHaveTextContent("John");
    expect(changeAge).toHaveTextContent(20);
    expect(changeAdmin).toHaveTextContent("No");
    expect(callback).not.toHaveBeenCalled();

    call.click();

    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback.mock.calls[0][0]).toBe("John");
    expect(callback.mock.calls[0][1]).toBe(20);
    expect(callback.mock.calls[0][2]).toBe(false);
    expect(changeName).toHaveTextContent("John");
    expect(changeAge).toHaveTextContent(20);
    expect(changeAdmin).toHaveTextContent("No");

    changeName.click();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(changeName).toHaveTextContent("Paul");
    expect(changeAge).toHaveTextContent(20);
    expect(changeAdmin).toHaveTextContent("No");

    call.click();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls[1][0]).toBe("Paul");
    expect(callback.mock.calls[1][1]).toBe(20);
    expect(callback.mock.calls[1][2]).toBe(false);

    changeAge.click();

    expect(callback).toHaveBeenCalledTimes(2);
    expect(changeName).toHaveTextContent("Paul");
    expect(changeAge).toHaveTextContent(25);
    expect(changeAdmin).toHaveTextContent("No");

    call.click();

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback.mock.calls[2][0]).toBe("Paul");
    expect(callback.mock.calls[2][1]).toBe(25);
    expect(callback.mock.calls[2][2]).toBe(false);

    changeAdmin.click();

    expect(callback).toHaveBeenCalledTimes(3);
    expect(changeName).toHaveTextContent("Paul");
    expect(changeAge).toHaveTextContent(25);
    expect(changeAdmin).toHaveTextContent("Yes");

    call.click();

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback.mock.calls[3][0]).toBe("Paul");
    expect(callback.mock.calls[3][1]).toBe(25);
    expect(callback.mock.calls[3][2]).toBe(true);
  });
});
