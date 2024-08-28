import "./index.css";
import { useEffect, useReducer, useState, ChangeEvent } from "react";

import ButtonPay from "../../component/button-pay";
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

export default function RecivePage() {
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

  const [stateAlert, setStateAlert] = useState<ALERT_NAME>({
    amount: "",
    disabled: "disabled",
  });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const e = event.target.value;
    setInputValue(e);

    const alert = validate("amount", e);

    if (alert.amount) {
      setStateAlert({
        amount: alert.amount,
        disabled: "disabled",
      });
    } else {
      setStateAlert({
        amount: null,
        disabled: "",
      });
    }
  };

  const handleButtonClick = async (e: string) => {
    const val: ALERT_NAME = validateAll({ amount: inputValue });
    setStateAlert(val);

    if (val.disabled === "") {
      dispatchRequest({
        type: REQUEST_ACTION_TYPE.PROGRESS as keyof typeof REQUEST_ACTION_TYPE,
      });

      try {
        const res = await fetch("http://localhost:4000/recive", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sum: inputValue,
            type: "Receipt",
            title: e,
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
    <div className="recive">
      <div className="recive__header">
        <BackButton />
        <Heading title="Receive" className="private" />
      </div>
      <div className="recive__main">
        <div className="recive__main-input">
          <h3>Receive amount</h3>
          <Input
            type="number"
            name="amount"
            placeholder="$500"
            onChange={handleInputChange}
            message={stateAlert.amount}
            value={inputValue}
          />
        </div>

        <div className="recive__main-button">
          <h3>Payment system</h3>
          <ButtonPay
            title="Stripe"
            logo="../../../svg/logo-stripe.svg"
            img="../../../svg/stripe.svg"
            onClick={() => handleButtonClick("Stripe")}
            disabled={stateAlert.disabled}
          />
          <ButtonPay
            title="Coinbase"
            logo="../../../svg/logo-coinbase.svg"
            img="../../../svg/coinbase.svg"
            onClick={() => handleButtonClick("Coinbase")}
            disabled={stateAlert.disabled}
          />
        </div>

        {stateRequest.status === REQUEST_ACTION_TYPE.ERROR && (
          <Alert
            img
            status={stateRequest.status}
            message={stateRequest.message}
          />
        )}
      </div>
    </div>
  );
}
