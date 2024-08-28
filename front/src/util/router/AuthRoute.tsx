import { useEffect } from "react";
import { loadSession } from "../session";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state, dispatch } = useAuth();

  useEffect(() => {
    if (!state.token) {
      const sessionLoadContextValue = loadSession();
      if (sessionLoadContextValue) {
        dispatch({
          type: "LOGIN",
          payload: {
            token: sessionLoadContextValue.token,
            user: sessionLoadContextValue.user,
          },
        });
      }
    }
  }, [dispatch, state]);

  return state.token ? <Navigate to="/balance" replace /> : <>{children}</>;
};

export {};
