import * as React from "react";

/**
 * Creates a callback, even with closures, that will be
 * instance === for the lifetime of the component, always
 * calling the most recent version of the function and its
 * closures.
 */
export default function useConstantCallback<T extends (...args: any[]) => any>(
  callback: T,
): T {
  const ref = React.useRef(callback);
  React.useEffect(() => {
    ref.current = callback;
  });
  return React.useCallback(
    (...args: any[]) => ref.current.apply(null, args),
    [],
  ) as T;
}
