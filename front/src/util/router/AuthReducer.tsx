export enum ActionTypes {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export type State = {
  token: string | null;
  user: object | null;
};

export type Action = {
  type: string;
  payload?: {
    token?: string;
    user?: object;
  };
};

export const initialState: State = {
  token: null,
  user: null,
};

export const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        token: action.payload?.token || null,
        user: action.payload?.user || null,
      };
    case ActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export {};
