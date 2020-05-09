export interface Action {
  type: string;
}

export type CreateReducerReducer<S, A> = (state: S, action: A) => S;

export type CreateReducerComponents<S, A> = Record<
  string,
  CreateReducerReducer<S, A>
>;

export const createReducer = <S, A extends Action>(
  components: CreateReducerComponents<S, A>
) => (state: S, action: A) =>
  components.hasOwnProperty(action.type)
    ? components[action.type](state, action)
    : state;

export interface InitialState {
  [key: string]: any;
}
