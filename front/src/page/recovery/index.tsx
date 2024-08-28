import "./index.css";
import { useReducer, useState, ChangeEvent, FormEvent } from "react";
import Button from "../../component/button";
import BackButton from "../../component/back-button";
import Heading from "../../component/heading";
import Input from "../../component/input";
import { useNavigate } from "react-router-dom";

import { Alert } from "../../component/load";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";
import { validate, validateAll, ALERT_NAME } from "../../util/form";

export default function RecoveryPage() {
  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );

  const navigate = useNavigate();

  const [emailValue, setEmailValue] = useState<string>("");

  const [stateAlert, setStateAlert] = useState<ALERT_NAME>({
    email: "",
    disabled: "disabled",
  });

  const handleEmailValue = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target.value;

    setEmailValue(e);

    const alert = validate("email", e);
    if (alert.email) {
      setStateAlert({
        email: alert.email,
        disabled: "disabled",
      });
    } else {
      setStateAlert({
        email: null,
        disabled: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = validateAll({ email: emailValue });
    setStateAlert(val);

    if (val.disabled === "") {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });

      try {
        const res = await fetch("http://localhost:4000/recovery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailValue }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.RESET as keyof typeof REQUEST_ACTION_TYPE,
          });
          navigate("/recovery-confirm");
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
    <div className="recovery">
      <BackButton />
      <div>
        <Heading
          title="Recover password"
          description="Choose a recovery method"
          className="auth"
        />
      </div>
      <form onSubmit={handleSubmit} className="recovery__main">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Введіть Ваш Email"
          onChange={handleEmailValue}
          value={emailValue}
          message={stateAlert.email}
        />

        <Button
          text="Send code"
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
