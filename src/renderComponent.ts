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
    // then add properties from rest (but don't overwrite getter-only properties)
    const result = {} as any;
    Object.defineProperties(result, Object.getOwnPropertyDescriptors(lazyProps));
    const restDescriptors = Object.getOwnPropertyDescriptors(rest);
    for (const key in restDescriptors) {
      const existingDescriptor = Object.getOwnPropertyDescriptor(result, key);
      // Skip getter-only properties (these would throw an error if we tried to overwrite them)
      if (existingDescriptor && existingDescriptor.get && !existingDescriptor.set) {
        continue;
      }
      // For everything else, allow rest to override lazyProps
      Object.defineProperty(result, key, restDescriptors[key]);
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
    // Add properties from rest (but don't overwrite getter-only properties)
    const restDescriptors = Object.getOwnPropertyDescriptors(rest);
    for (const key in restDescriptors) {
      const existingDescriptor = Object.getOwnPropertyDescriptor(result as any, key);
      // Skip getter-only properties
      if (existingDescriptor && existingDescriptor.get && !existingDescriptor.set) {
        continue;
      }
      Object.defineProperty(result as any, key, restDescriptors[key]);
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
  // Add properties from rest (but don't overwrite getter-only properties)
  const restDescriptors = Object.getOwnPropertyDescriptors(rest);
  for (const key in restDescriptors) {
    const existingDescriptor = Object.getOwnPropertyDescriptor(result as any, key);
    // Skip getter-only properties
    if (existingDescriptor && existingDescriptor.get && !existingDescriptor.set) {
      continue;
    }
    Object.defineProperty(result as any, key, restDescriptors[key]);
  }
  return children(result);
}
