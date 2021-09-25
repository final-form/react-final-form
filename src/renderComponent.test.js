import renderComponent from "./renderComponent";

describe("renderComponent", () => {
  it("should pass both render and children prop", () => {
    const children = "some children";
    const render = () => {};
    const props = {
      component: () => null,
      children,
      render,
    };
    const name = "TestComponent";
    const result = renderComponent(props, {}, name);
    expect(result.props).toEqual({ children, render });
  });

  it("should include children when rendering with render", () => {
    const children = "some children";
    const render = jest.fn();
    const props = {
      children,
      render,
    };
    const name = "TestComponent";
    renderComponent(props, {}, name);
    expect(render).toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);
    expect(render.mock.calls[0][0].children).toBe(children);
  });

  it("should throw error if no render strategy is provided", () => {
    const children = "some children";
    const props = {
      children,
    };
    const name = "TestComponent";
    expect(() => renderComponent(props, {}, name)).toThrow(
      `Must specify either a render prop, a render function as children, or a component prop to ${name}`,
    );
  });

  it("should not evaluate any of the keys given in the second argument", () => {
    const children = "some children";
    const render = jest.fn();
    const props = {
      children,
      render,
    };
    const getA = jest.fn();
    const getB = jest.fn();
    const name = "TestComponent";
    renderComponent(
      props,
      {
        get a() {
          getA();
          return 1;
        },
        get b() {
          getB();
          return 2;
        },
      },
      name,
    );
    expect(render).toHaveBeenCalled();
    expect(render).toHaveBeenCalledTimes(1);
    expect(render.mock.calls[0][0].children).toBe(children);
    expect(getA).not.toHaveBeenCalled();
    expect(getB).not.toHaveBeenCalled();
  });
});
