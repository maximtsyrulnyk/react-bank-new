import { FC, MouseEventHandler } from "react";
import "./index.css";

interface ComponentProps {
  title: string;
  logo: string;
  img: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: string;
}

const Component: FC<ComponentProps> = ({
  title,
  logo,
  img,
  onClick,
  disabled = "disabled",
}) => {
  return (
    <button onClick={onClick} className={`payment__sys ${disabled}`}>
      <div>
        <span>
          <img src={logo} width="19" height="19" alt="" />
        </span>
        <span>{title}</span>
      </div>
      <span>
        <img src={img} width="161" height="21" alt="" />
      </span>
    </button>
  );
};

export default Component;
