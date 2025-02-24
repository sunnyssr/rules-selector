import { ReactNode } from "react";

type PageProps = {
  children: ReactNode;
};

const Page = (props: PageProps) => {
  return <div className="page">{props.children}</div>;
};

export default Page;
