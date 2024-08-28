import "./index.css";
import { useReducer, useState, useEffect, FormEvent } from "react";
import Button from "../../component/button";
import BackButton from "../../component/back-button";
import Heading from "../../component/heading";
import Input from "../../component/input";
import InputPassword from "../../component/input-password";
import { Link, useNavigate } from "react-router-dom";

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
  email: string;
  password: string;
}

export default function SignupPage() {
  const [stateRequest, dispatchRequest] = useReducer(
    requestReducer,
    requestInitialState
  );
  const { dispatch } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [stateAlert, setStateAlert] = useState<ALERT_NAME>({
    email: "",
    password: "",
    disabled: "disabled",
  });

  useEffect(() => {
    setStateAlert((prevState) => {
      if (prevState.email === null && prevState.password === null) {
        return {
          ...prevState,
          disabled: "",
        };
      }
      return prevState;
    });
  }, [stateAlert.email, stateAlert.password]);

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
        const res = await fetch("http://localhost:4000/signup", {
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

          navigate("/signup-confirm");
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
    <div className="signup">
      <BackButton />
      <div>
        <Heading
          title="Sign up"
          description="Choose a registration method"
          className="auth"
        />
      </div>
      <form onSubmit={handleSubmit} className="signup__main">
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Ваш email"
          value={formData.email}
          onChange={(event) => handleChange("email", event.target.value)}
          message={stateAlert.email}
        />
        <InputPassword
          label="Password"
          placeholder="Ваш пароль"
          value={formData.password}
          onChange={(value) => handleChange("password", value)}
          name="password"
          message={stateAlert.password}
        />
        <span className="link__prefix">
          Already have an account?{" "}
          <Link to="/signin" className="link">
            Sign In
          </Link>
        </span>

        <Button
          text="Continue"
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
