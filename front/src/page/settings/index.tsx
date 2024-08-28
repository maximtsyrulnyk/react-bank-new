import "./index.css";
import { useReducer, useState, FormEvent } from "react";
import Button from "../../component/button";

import BackButton from "../../component/back-button";
import Heading from "../../component/heading";
import Input from "../../component/input";
import InputPassword from "../../component/input-password";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../util/router/AuthContext";
import { saveSession } from "../../util/session";
import { Alert } from "../../component/load";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";
import { validate, validateAll, ALERT_NAME } from "../../util/form";
import { ActionTypes } from "../../util/router/AuthReducer";

interface FormDataEmail {
  email: string;
  password: string;
}

interface FormDataPassword {
  oldPassword: string;
  newPassword: string;
}

export default function SettingsPage() {
  const [stateRequestEmail, dispatchRequestEmail] = useReducer(
    requestReducer,
    requestInitialState
  );

  const [stateRequestPassword, dispatchRequestPassword] = useReducer(
    requestReducer,
    requestInitialState
  );

  const { state, dispatch } = useAuth();

  const navigate = useNavigate();

  const [formDataEmail, setFormDataEmail] = useState<FormDataEmail>({
    email: "",
    password: "",
  });

  const [stateAlertEmail, setStateAlertEmail] = useState<ALERT_NAME>({
    email: "",
    disabled: "disabled",
  });

  const [formDataPassword, setFormDataPassword] = useState<FormDataPassword>({
    oldPassword: "",
    newPassword: "",
  });

  const [stateAlertPassword, setStateAlertPassword] = useState<ALERT_NAME>({
    password: "",
    disabled: "disabled",
  });

  const handleChangeEmail = (fieldName: string, value: string) => {
    setFormDataEmail({
      ...formDataEmail,
      [fieldName]: value,
    });

    if (fieldName === "email") {
      const alert = validate("email", value);
      if (alert.email) {
        setStateAlertEmail({
          email: alert.email,
          disabled: "disabled",
        });
      } else {
        setStateAlertEmail({
          email: null,
          disabled: "",
        });
      }
    }
  };

  const handleChangePassword = (fieldName: string, value: string) => {
    setFormDataPassword({
      ...formDataPassword,
      [fieldName]: value,
    });

    if (fieldName === "newPassword") {
      const alert = validate("password", value);
      if (alert.password) {
        setStateAlertPassword({
          password: alert.password,
          disabled: "disabled",
        });
      } else {
        setStateAlertPassword({
          password: null,
          disabled: "",
        });
      }
    }
  };

  const handleSubmitEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = validateAll({ email: formDataEmail.email });
    setStateAlertEmail(val);

    if (val.disabled === "") {
      dispatchRequestEmail({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });
      try {
        const res = await fetch("http://localhost:4000/settings-change-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formDataEmail,
            token: state.token,
            user: state.user,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatchRequestEmail({
            type: REQUEST_ACTION_TYPE.RESET as keyof typeof REQUEST_ACTION_TYPE,
          });
          dispatch({
            type: ActionTypes.LOGIN,
            payload: {
              token: data.sessionUser.token,
              user: data.sessionUser.user,
            },
          });

          saveSession({
            token: data.sessionUser.token,
            user: data.sessionUser.user,
          });

          navigate("/balance");
        } else {
          dispatchRequestEmail({
            type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
            payload: data.message,
          });
        }
      } catch (error: any) {
        dispatchRequestEmail({
          type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
          payload: error.message,
        });
      }
    }
  };

  const handleSubmitPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = validateAll({ password: formDataPassword.newPassword });
    setStateAlertPassword(val);

    if (val.disabled === "") {
      dispatchRequestPassword({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });

      try {
        const res = await fetch(
          "http://localhost:4000/settings-change-password",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formDataPassword,
              token: state.token,
              user: state.user,
            }),
          }
        );

        const data = await res.json();

        if (res.ok) {
          dispatchRequestPassword({
            type: REQUEST_ACTION_TYPE.RESET as keyof typeof REQUEST_ACTION_TYPE,
          });
          navigate("/balance");
        } else {
          dispatchRequestPassword({
            type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
            payload: data.message,
          });
        }
      } catch (error: any) {
        dispatchRequestPassword({
          type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
          payload: error.message,
        });
      }
    }
  };

  const handleSubmitLogOut = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    sessionStorage.clear();

    dispatch({
      type: ActionTypes.LOGOUT,
    });
  };

  return (
    <div className="settings">
      <div className="settings__header">
        <BackButton />
        <Heading title="Settings" className="private" />
      </div>
      <div className="settings__main">
        <div className="settings__main-form">
          <h3>Change email</h3>
          <form onSubmit={handleSubmitEmail} className="settings__form">
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="Ваш email"
              value={formDataEmail.email}
              onChange={(event) =>
                handleChangeEmail("email", event.target.value)
              }
              message={stateAlertEmail.email}
            />
            <InputPassword
              label="Old Password"
              placeholder="Ваш пароль"
              value={formDataEmail.password}
              onChange={(value) => handleChangeEmail("password", value)}
              name="password"
            />

            <Button
              text="Save Email"
              className="white"
              disabled={stateAlertEmail.disabled}
            />

            {stateRequestEmail.status === REQUEST_ACTION_TYPE.ERROR && (
              <Alert
                img
                status={stateRequestEmail.status}
                message={stateRequestEmail.message}
              />
            )}
          </form>
        </div>
        <div className="settings__main-divider"></div>
        <div className="settings__main-form">
          <h3>Change password</h3>
          <form onSubmit={handleSubmitPassword} className="settings__form">
            <InputPassword
              label="Old Password"
              placeholder="Ваш пароль"
              value={formDataPassword.oldPassword}
              onChange={(value) => handleChangePassword("oldPassword", value)}
              name="oldPassword"
            />
            <InputPassword
              label="New Password"
              placeholder="Ваш пароль"
              value={formDataPassword.newPassword}
              onChange={(value) => handleChangePassword("newPassword", value)}
              name="password"
              message={stateAlertPassword.password}
            />

            <Button
              text="Save Password"
              className="white"
              disabled={stateAlertPassword.disabled}
            />

            {stateRequestPassword.status === REQUEST_ACTION_TYPE.ERROR && (
              <Alert
                img
                status={stateRequestPassword.status}
                message={stateRequestPassword.message}
              />
            )}
          </form>
        </div>
        <div className="settings__main-divider"></div>

        <div className="settings__main-form">
          <form onSubmit={handleSubmitLogOut} className="settings__form">
            <Button text="Log out" className="red" disabled="" />
          </form>
        </div>
      </div>
    </div>
  );
}
