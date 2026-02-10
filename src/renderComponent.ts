import * as React from "react";
import type { RenderableProps } from "./types";

// shared logic between components that use either render prop,
// children render function, or component prop
export default function renderComponent<T>(
  props: RenderableProps<T> & Partial<T> & Record<string, any>,
  lazyProps: Record<string, any>,
  name: string,
): React.ReactNode {
  const { render, children, component, ...rest } = props;
  if (component) {
    // FIX: Don't use Object.assign which tries to overwrite getters
    // Instead, create a new object with lazyProps descriptors first,
    // then add non-conflicting properties from rest
    const result = {} as any;
    Object.defineProperties(result, Object.getOwnPropertyDescriptors(lazyProps));
    const restDescriptors = Object.getOwnPropertyDescriptors(rest);
    for (const key in restDescriptors) {
      if (!Object.prototype.hasOwnProperty.call(result, key)) {
        Object.defineProperty(result, key, restDescriptors[key]);
      }
    }
    result.children = children;
    result.render = render;
    return React.createElement(component, result);
  }
  if (render) {
    const result = {} as T;
    Object.defineProperties(
      result,
      Object.getOwnPropertyDescriptors(lazyProps),
    );
    // Only add properties from rest that don't already exist
    const restDescriptors = Object.getOwnPropertyDescriptors(rest);
    for (const key in restDescriptors) {
      if (!(key in (result as any))) {
        Object.defineProperty(result as any, key, restDescriptors[key]);
      }
    }
    if (children !== undefined) {
      (result as any).children = children;
    }
    return render(result);
  }
  if (typeof children !== "function") {
    throw new Error(
      `Must specify either a render prop, a render function as children, or a component prop to ${name}`,
    );
  }
  const result = {} as T;
  Object.defineProperties(result, Object.getOwnPropertyDescriptors(lazyProps));
  // Only add properties from rest that don't already exist
  const restDescriptors = Object.getOwnPropertyDescriptors(rest);
  for (const key in restDescriptors) {
    if (!(key in (result as any))) {
      Object.defineProperty(result as any, key, restDescriptors[key]);
    }
  }
  return children(result);
}
