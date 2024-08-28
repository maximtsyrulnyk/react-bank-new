import React, { useReducer } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WellcomePage from "./page/wellcome";
import Page from "./component/page";
import SignupPage from "./page/signup";
import SigninPage from "./page/signin";
import SignupConfirmPage from "./page/signup-confirm";
import RecoveryConfirmPage from "./page/recovery-confirm";
import RecoveryPage from "./page/recovery";
import BalancePage from "./page/balance";
import RecivePage from "./page/recive";
import SendPage from "./page/send";
import NotificationsPage from "./page/notifications";
import SettingsPage from "./page/settings";
import TransactionPage from "./page/transaction";
import { PrivateRoute } from "./util/router/PrivateRoute";
import { AuthRoute } from "./util/router/AuthRoute";
import { authReducer, initialState } from "./util/router/AuthReducer";
import { AuthContext, ContextType } from "./util/router/AuthContext";

const Error: React.FC = () => {
  return <div className="page heading">Error Page</div>;
};

function App() {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const authContextData: ContextType = { state, dispatch };

  return (
    <Page>
      <AuthContext.Provider value={authContextData}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <AuthRoute>
                  <WellcomePage />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              }
            />
            <Route
              path="/signup-confirm"
              element={
                <PrivateRoute>
                  <SignupConfirmPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <AuthRoute>
                  <SigninPage />
                </AuthRoute>
              }
            />
            <Route
              path="/recovery"
              element={
                <AuthRoute>
                  <RecoveryPage />
                </AuthRoute>
              }
            />
            <Route
              path="/recovery-confirm"
              element={
                <AuthRoute>
                  <RecoveryConfirmPage />
                </AuthRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <BalancePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/recive"
              element={
                <PrivateRoute>
                  <RecivePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/send"
              element={
                <PrivateRoute>
                  <SendPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction/:transactionId"
              element={
                <PrivateRoute>
                  <TransactionPage />
                </PrivateRoute>
              }
            />
            <Route path="*" Component={Error} />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </Page>
  );
}

export default App;
