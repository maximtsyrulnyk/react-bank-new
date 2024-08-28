import React, { createContext, useContext } from "react";

import { Action, State } from "./AuthReducer";

export type ContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export const AuthContext = createContext<ContextType | null>(null);

export const useAuth: any = () => {
  return useContext(AuthContext);
};

export {};
