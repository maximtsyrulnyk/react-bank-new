import React from "react";
import "./index.css";

const BackButton: React.FC = () => {
  return (
    <div className="back-button" onClick={() => window.history.back()}>
      <img src="../../../svg/back-button.svg" alt="<" width="25" height="25" />
    </div>
  );
};

export default BackButton;
