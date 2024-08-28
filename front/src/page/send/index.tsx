import "./index.css";
import { ChangeEvent, useEffect, useReducer, useState, FormEvent } from "react";
import Button from "../../component/button";

import BackButton from "../../component/back-button";
import Heading from "../../component/heading";
import Input from "../../component/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../util/router/AuthContext";
import { Alert } from "../../component/load";

import {
  requestInitialState,
  requestReducer,
  REQUEST_ACTION_TYPE,
} from "../../util/request";
import { validate, validateAll, ALERT_NAME } from "../../util/form";

export default function SendPage() {
  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );

  const { state } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (!state.user.isConfirm) {
      navigate("/signup-confirm");
    }
  }, []);

  const [inputValue, setInputValue] = useState<string>("");

  const [recipientEmail, setRecipientEmail] = useState<string>("");

  const [stateAlert, setStateAlert] = useState<ALERT_NAME>({
    email: "",
    amount: "",
    disabled: "disabled",
  });

  useEffect(() => {
    setStateAlert((prevState) => {
      if (prevState.email === null && prevState.amount === null) {
        return {
          ...prevState,
          disabled: "",
        };
      }
      return prevState;
    });
  }, [stateAlert.email, stateAlert.amount]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target.value;
    setInputValue(e);

    const alert = validate("amount", e);

    if (alert.amount) {
      setStateAlert({
        ...stateAlert,
        amount: alert.amount,
        disabled: "disabled",
      });
    } else {
      setStateAlert({
        ...stateAlert,
        amount: null,
      });
    }
  };

  const handleRecipientEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target.value;

    setRecipientEmail(e);
    const alert = validate("email", e);

    if (alert.email) {
      setStateAlert({
        ...stateAlert,
        email: alert.email,
        disabled: "disabled",
      });
    } else {
      setStateAlert({
        ...stateAlert,
        email: null,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const val = validateAll({ email: recipientEmail, amount: inputValue });
    setStateAlert(val);

    if (val.disabled === "") {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });

      try {
        const res = await fetch("http://localhost:4000/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sum: inputValue,
            type: "Sending",
            email: recipientEmail,
            token: state.token,
            user: state.user,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          dispatchRequest({
            type: REQUEST_ACTION_TYPE.RESET as keyof typeof REQUEST_ACTION_TYPE,
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
    <div className="send">
      <div className="send__header">
        <BackButton />
        <Heading title="Send" className="private" />
      </div>
      <form onSubmit={handleSubmit} className="send__main">
        <Input
          type="email"
          label="Email"
          name="email"
          placeholder="Введіть Ваш Email"
          onChange={handleRecipientEmailChange}
          message={stateAlert.email}
          value={recipientEmail}
        />
        <Input
          type="number"
          label="Sum"
          name="amount"
          placeholder="$500"
          onChange={handleInputChange}
          message={stateAlert.amount}
          value={inputValue}
        />

        <Button
          text="Send"
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
