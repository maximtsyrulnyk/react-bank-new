import { ChangeEvent, FC } from "react";
import "./index.css";
import "../../style/form.css";

interface ComponentProps {
  label?: string;
  type: string;
  name: string;
  placeholder: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  message?: string | null;
}

const Component: FC<ComponentProps> = ({
  label,
  type,
  name,
  placeholder,
  onChange,
  value = "",
  message,
}) => {
  return (
    <div className="field">
      {label && (
        <label htmlFor={name} className="field__label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`field__input ${message && "error"}`}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />{" "}
      {message && <span className="form---error">{message}</span>}
    </div>
  );
};

export default Component;
