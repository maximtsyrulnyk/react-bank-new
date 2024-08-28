import { FC } from "react";
import "./index.css";

interface ComponentProps {
  text: string;
  className: string;
  disabled?: string;
}

const Component: FC<ComponentProps> = ({
  text,
  className,
  disabled = "disabled",
}) => {
  return (
    <button type="submit" className={`btn btn--${className} ${disabled}`}>
      {text}
    </button>
  );
};

export default Component;
