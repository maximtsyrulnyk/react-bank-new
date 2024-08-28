import "./index.css";
import { useReducer, useState, ChangeEvent, FormEvent } from "react";
import Button from "../../component/button";
import BackButton from "../../component/back-button";
import Heading from "../../component/heading";
import Input from "../../component/input";
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

export default function SignupConfirmPage() {
  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );

  const { state, dispatch } = useAuth();

  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>("");

  const [stateAlert, setStateAlert] = useState<ALERT_NAME>({
    code: "",
    disabled: "disabled",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target.value;
    setInputValue(e);

    const alert = validate("code", e);
    if (alert.code) {
      setStateAlert({
        code: alert.code,
        disabled: "disabled",
      });
    } else {
      setStateAlert({
        code: null,
        disabled: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const val = validateAll({ code: inputValue });
    setStateAlert(val);

    if (val.disabled === "") {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });

      try {
        const res = await fetch("http://localhost:4000/signup-confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: inputValue, token: state.token }),
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

          navigate("/balance");
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
    <div className="signup-confirm">
      <BackButton />
      <div>
        <Heading
          title="Confirm account"
          description="Write the code you received"
          className="auth"
        />
      </div>
      <form onSubmit={handleSubmit} className="signup-confirm__main">
        <Input
          label="Code"
          type="number"
          name="code"
          placeholder="Введіть код підтвердження"
          value={inputValue}
          onChange={handleInputChange}
          message={stateAlert.code}
        />

        <Button
          text="Confirm"
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
