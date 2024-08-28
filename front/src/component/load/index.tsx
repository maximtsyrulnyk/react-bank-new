import { FC } from "react";
import "./index.css";

enum LOAD_STATUS {
  PROGRESS = "progress",
  SUCCESS = "success",
  ERROR = "error",
}

interface AlertProps {
  message: string;
  status?: LOAD_STATUS | "default" | string;
  img?: string | null | boolean;
}

export const Alert: FC<AlertProps> = ({ message, status = "default", img }) => {
  return (
    <div className={`alert alert--${status}`}>
      {img && <span className="alert--img"></span>}
      <span>{message}</span>
    </div>
  );
};

export const Loader: FC = () => <div className="loader"></div>;

export const Skeleton: FC = () => {
  return (
    <div className="skeleton">
      <div className="skeleton__item"></div>
      <div className="skeleton__item"></div>
      <div className="skeleton__item"></div>
    </div>
  );
};
