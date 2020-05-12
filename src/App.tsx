import React from "react";
import { Store } from "./lib/index";
import { createReducer, InitialState } from "./lib/types";
import "./app.css";

export function withAdditionalProps<T>(
  injectedProps: Record<string, any>,
  WrappedComponent: React.ComponentType<T>,
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithAdditionalProps = (props: Omit<T, keyof typeof injectedProps>) => {
    return <WrappedComponent {...injectedProps} {...(props as T)} />;
  };

  ComponentWithAdditionalProps.displayName = `withAdditionalProps(${displayName})`;

  return ComponentWithAdditionalProps;
}

interface AppState {
  counter: number;
  testProp: string;
}

export default withAdditionalProps<AppState>(
  {
    counter: 0,
  },
  (props) => {
    return <div>{props.counter}</div>;
  },
);
