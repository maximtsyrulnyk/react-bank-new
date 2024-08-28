import React, { FC } from "react";
import "./index.css";

interface ComponentProps {
  img: string;
  date: string;
  title: string;
  type: string;
  sum?: number | null;
  isPositive?: boolean | null;
}

const Component: FC<ComponentProps> = ({
  img,
  date,
  title,
  type,
  sum = null,
  isPositive = null,
}) => {
  return (
    <div className="bal-item">
      <div className="bal-item__block">
        <span>
          <img height={25} width={25} src={img} alt="Icon" />
        </span>
        <div className="bal-item__content">
          <h4>{title}</h4>
          <div>
            <span className="post-content__date">{date}</span>
            <span className="post-content__username"></span>
            <span className="post-content__type">{type}</span>
          </div>
        </div>
      </div>

      <div className={`bal-item__sum ${isPositive ? "positive__sum" : ""}`}>
        <strong>
          {isPositive ? "+" : ""}
          {sum}
        </strong>
      </div>
    </div>
  );
};

export default React.memo(Component);
