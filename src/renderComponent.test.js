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

  it("should not overwrite getter-only properties when using component prop", () => {
    // This test reproduces issue #1055
    // When lazyProps has getter-only properties (like 'active'), and props contains
    // a property with the same name, it should not attempt to overwrite the getter
    const Component = () => null;
    const props = {
      component: Component,
      active: "value-from-props", // This would cause "Cannot set property active" error
      customProp: "custom",
    };
    const lazyProps = {};
    Object.defineProperty(lazyProps, "active", {
      get: () => "value-from-getter",
      enumerable: true,
      // Note: no setter - this is getter-only
    });
    const name = "TestComponent";

    // Should not throw "Cannot set property active"
    let result;
    expect(() => {
      result = renderComponent(props, lazyProps, name);
    }).not.toThrow();

    // Check the React element was created with correct props
    expect(result.type).toBe(Component);
    
    // The getter-only property should remain and use the getter value
    expect(result.props.active).toBe("value-from-getter");

    // Custom props should still be passed through
    expect(result.props.customProp).toBe("custom");
  });

  it("should handle getter-only properties in all render paths", () => {
    const lazyProps = {};
    Object.defineProperty(lazyProps, "active", {
      get: () => "getter-value",
      enumerable: true,
    });

    // Test with render prop
    const render = jest.fn();
    renderComponent(
      { render, active: "prop-value" },
      lazyProps,
      "TestComponent",
    );
    expect(render).toHaveBeenCalled();
    expect(render.mock.calls[0][0].active).toBe("getter-value");

    // Test with children function
    const children = jest.fn();
    renderComponent(
      { children, active: "prop-value" },
      lazyProps,
      "TestComponent",
    );
    expect(children).toHaveBeenCalled();
    expect(children.mock.calls[0][0].active).toBe("getter-value");

    // Test with component prop
    const Component = () => null;
    const result = renderComponent(
      { component: Component, active: "prop-value" },
      lazyProps,
      "TestComponent",
    );
    expect(result.type).toBe(Component);
    expect(result.props.active).toBe("getter-value");
  });
});

describe("renderComponent - Issue #1048", () => {
  it("should allow rest props to override lazyProps data properties", () => {
    const Component = () => null;
    const lazyProps = {
      input: {
        value: "",
        onChange: () => {},
      },
    };

    const customInput = {
      value: "foo",
      onChange: () => {},
    };

    const result = renderComponent(
      { component: Component, input: customInput },
      lazyProps,
      "Field",
    );

    expect(result.type).toBe(Component);
    // The custom input prop should override the lazyProps input
    expect(result.props.input).toBe(customInput);
    expect(result.props.input.value).toBe("foo");
  });

  it("should still protect getter-only properties from being overwritten", () => {
    const Component = () => null;
    const lazyProps = {
      data: { regular: "value" },
    };

    // Add a getter-only property
    Object.defineProperty(lazyProps, "active", {
      get: () => "getter-value",
      enumerable: true,
    });

    const result = renderComponent(
      { component: Component, active: "override-attempt", custom: "prop" },
      lazyProps,
      "Field",
    );

    expect(result.type).toBe(Component);
    // Getter-only property should NOT be overridden
    expect(result.props.active).toBe("getter-value");
    // Regular data property should be overridable
    expect(result.props.custom).toBe("prop");
  });
});
