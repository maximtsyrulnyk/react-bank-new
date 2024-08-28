import { ReactNode } from "react";
import "./index.css";

interface ComponentProps {
  children: ReactNode;
}

const Component: React.FC<ComponentProps> = ({ children }) => {
  return <div className="page">{children}</div>;
};

export default Component;
