import React from "react";

export const wrapWith =
  <T extends any[]>(mock: (...args: T) => void, fn: (...args: T) => any) =>
  (...args: T) => {
    mock(...args);
    return fn(...args);
  };

/** A simple container component that allows boolean to be toggled with a button */
export function Toggle({
  children,
}: {
  children: (on: boolean) => React.ReactNode;
}) {
  const [on, setOn] = React.useState(false);
  return React.createElement(
    "div",
    null,
    children(on),
    React.createElement("button", { onClick: () => setOn(!on) }, "Toggle"),
  );
}

interface ErrorBoundaryProps {
  spy: (error: Error) => void;
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  componentDidCatch(error: Error) {
    this.props.spy(error);
  }

  render() {
    return this.props.children;
  }
}
