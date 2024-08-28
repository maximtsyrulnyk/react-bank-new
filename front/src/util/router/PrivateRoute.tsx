import { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { loadSession } from "../session";
import { Navigate } from "react-router-dom";

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
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

  return state.token ? <>{children}</> : <Navigate to="/" replace />;
};

export {};
