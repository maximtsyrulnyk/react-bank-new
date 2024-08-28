import { FC } from "react";
import "./index.css";

interface ComponentProps {
  title: string;
  description?: string;
  className?: string;
}

const Component: FC<ComponentProps> = ({ title, description, className }) => {
  return (
    <div className="heading">
      <div className={className}>{title}</div>
      {description && <p>{description}</p>}
    </div>
  );
};

export default Component;
