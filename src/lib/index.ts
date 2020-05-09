import { InitialState, createReducer, Action } from "./types";

function SubscriptionListener() {
  const events: Record<string, ((...args: any[]) => void)[]> = {};

  function subscribe(event: string, callback: (...args: any[]) => void) {
    if (!events.hasOwnProperty(event)) {
      events[event] = [];
    }
    return events[event].push(callback);
  }

  function listen(event: string, data = {}) {
    if (!events.hasOwnProperty(event)) {
      return [];
    }
    return events[event].map((callback) => callback(data));
  }

  return {
    events,
    subscribe,
    listen,
  };
}

function Store(args: {
  state: InitialState;
  actions: {
    [key: string]: (
      state: InitialState,
      payload: any,
      getState?: InitialState
    ) => Record<string, any>;
  };
  reducer: typeof createReducer;
}) {
  const events = SubscriptionListener();
  const actions = args.actions || {};
  const reducer = args.reducer || {};

  let state = new Proxy(args.state || {}, {
    set: function (state, key, value) {
      state[key.toString()] = value;
      events.listen("stateChange", state);
      return true;
    },
  });

  function getState() {
    return Object.assign({}, state);
  }

  function dispatch(actionKey: string, payload: any) {
    if (!actions.hasOwnProperty(actionKey)) {
      return false;
    }
    state = { ...state, ...actions[actionKey](state, payload, getState) };
    return true;
  }

  return { state, dispatch };
}

export { Store };
