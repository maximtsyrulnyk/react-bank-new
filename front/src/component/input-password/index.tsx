import { ChangeEvent, FC, useState } from "react";
import "./index.css";
import "../../style/form.css";

interface ComponentProps {
  label: string;
  name: string;
  placeholder: string;
  onChange?: (value: string) => void;
  value?: string;
  message?: string | null;
}

const Component: FC<ComponentProps> = ({
  label,
  name,
  placeholder,
  onChange,
  value = "",
  message,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const handleToggleClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="field">
      <label htmlFor={name} className="field__label">
        {label}
      </label>
      <div className="field__wrapper">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={handleInputChange}
          className={`field__input ${message && "error"}`}
          placeholder={placeholder}
          name={name}
        />
        <span
          onClick={handleToggleClick}
          className={showPassword ? "field__icon hide" : "field__icon show"}
        ></span>{" "}
      </div>{" "}
      {message && <span className="form---error">{message}</span>}
    </div>
  );
};

export default Component;
