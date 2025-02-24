import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

const Card = (props: CardProps) => {
  return <div className="card">{props.children}</div>;
};

export default Card;
