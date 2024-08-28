import "./index.css";
import { useEffect, useReducer, useState, FormEvent } from "react";
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

interface FormData {
  code: string;
  password: string;
}

export default function RecoveryConfirmPage() {
  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );

  const { dispatch } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    code: "",
    password: "",
  });

  const [stateAlert, setStateAlert] = useState<ALERT_NAME>({
    code: "",
    password: "",
    disabled: "disabled",
  });

  useEffect(() => {
    setStateAlert((prevState) => {
      if (prevState.code === null && prevState.password === null) {
        return {
          ...prevState,
          disabled: "",
        };
      }
      return prevState;
    });
  }, [stateAlert.code, stateAlert.password]);

  const handleChange = (fieldName: string, value: string) => {
    setFormData({
      ...formData,
      [fieldName]: value,
    });

    const alert = validate(fieldName, value);

    if (alert[fieldName]) {
      setStateAlert({
        ...stateAlert,
        [fieldName]: alert[fieldName],
        disabled: "disabled",
      });
    } else {
      setStateAlert({
        ...stateAlert,
        [fieldName]: null,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = validateAll(formData);
    setStateAlert(val);

    if (val.disabled === "") {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });

      try {
        const res = await fetch("http://localhost:4000/recovery-confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (res.ok) {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.RESET as keyof typeof REQUEST_ACTION_TYPE,
          });

          dispatch({
            type: ActionTypes.LOGIN,
            payload: {
              token: data.session.token,
              user: data.session.user,
            },
          });

          saveSession({
            token: data.session.token,
            user: data.session.user,
          });

          if (data.session.user.isConfirm) {
            navigate("/balance");
          } else {
            navigate("/signup-confirm");
          }
        } else {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
            payload: data.message,
          });
        }
      } catch (error: any) {
        dispatchRequest({
          type: REQUEST_ACTION_TYPE.ERROR as keyof typeof REQUEST_ACTION_TYPE,
          payload: error.message,
        });
      }
    }
  };

  return (
    <div className="recovery-confirm">
      <BackButton />
      <div>
        <Heading
          title="Recover password"
          description="Write the code you received"
          className="auth"
        />
      </div>
      <form onSubmit={handleSubmit} className="recovery-confirm__main">
        <Input
          label="Code"
          type="number"
          name="code"
          placeholder="Введіть код підтвердження"
          value={formData.code}
          onChange={(event) => handleChange("code", event.target.value)}
          message={stateAlert.code}
        />
        <InputPassword
          label="New password"
          placeholder="Новий пароль"
          value={formData.password}
          onChange={(value) => handleChange("password", value)}
          name="password"
          message={stateAlert.password}
        />

        <Button
          text="Restore password"
          className="primary"
          disabled={stateAlert.disabled}
        />

        {stateRequest.status === REQUEST_ACTION_TYPE.ERROR && (
          <Alert
            img
            status={stateRequest.status}
            message={stateRequest.message}
          />
        )}
      </form>
    </div>
  );
}
