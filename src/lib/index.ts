import { createContext, useContext, useState, useLayoutEffect } from "react";
import { InitialState, createReducer, Action } from "./types";

const SubscriptionListener = () => {
  const events: Record<string, ((...args: any[]) => void)[]> = {};

  const subscribe = (event: string, callback: (...args: any[]) => void) => {
    if (!events.hasOwnProperty(event)) {
      events[event] = [];
    }
    return events[event].push(callback);
  };

  const listen = (event: string, data = {}) => {
    if (!events.hasOwnProperty(event)) {
      return [];
    }
    return events[event].map((callback) => callback(data));
  };

  return {
    events,
    subscribe,
    listen,
  };
};

export const Store = (args: {
  state: InitialState;
  actions: {
    [key: string]: (
      state: InitialState,
      payload: any,
      getState?: InitialState
    ) => Record<string, any>;
  };
  reducer: (state: InitialState, action: Action) => InitialState;
}) => {
  const listener = SubscriptionListener();
  const actions = args.actions || {};
  const reducer = args.reducer || {};

  let state = new Proxy(args.state || {}, {
    set: function (state, key, value) {
      state[key.toString()] = value;
      listener.listen("stateChange", state);
      return true;
    },
  });

  const getState = () => {
    return Object.assign({}, state);
  };

  const dispatch = (actionKey: string, payload: any) => {
    if (!actions.hasOwnProperty(actionKey)) {
      return false;
    }
    state = { ...state, ...actions[actionKey](state, payload, getState) };
    return true;
  };

  return { state, dispatch };
};
