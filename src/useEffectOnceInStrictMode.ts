import * as React from "react";

/**
 * A hook that runs an effect only once, even in React 18 StrictMode.
 * 
 * In React 18 StrictMode, components are intentionally mounted, unmounted,
 * and remounted to help detect issues. This hook prevents the effect cleanup
 * from running during the StrictMode test unmount, only running it on real unmounts.
 * 
 * This is necessary for react-final-form's destroyOnUnregister feature to work
 * correctly in StrictMode - we don't want to destroy field values during the
 * StrictMode test unmount since the field will immediately remount.
 */
export default function useEffectOnceInStrictMode(
  effect: () => void | (() => void),
  deps?: React.DependencyList
): void {
  const hasRunRef = React.useRef(false);
  const cleanupRef = React.useRef<void | (() => void)>();

  React.useEffect(() => {
    // In production (no StrictMode), always run the effect
    // In development with StrictMode, only run on first mount
    if (!hasRunRef.current) {
      hasRunRef.current = true;
      cleanupRef.current = effect();
    }

    // Return a cleanup function that runs the saved cleanup
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
