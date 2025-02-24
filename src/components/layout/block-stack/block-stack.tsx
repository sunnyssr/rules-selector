import { ReactNode } from "react";

type Align =
  | "start"
  | "center"
  | "end"
  | "space-around"
  | "space-between"
  | "space-evenly";

type InlineAlign = "start" | "center" | "end" | "baseline" | "stretch";
type Gap =
  | "0"
  | "050"
  | "100"
  | "150"
  | "200"
  | "250"
  | "300"
  | "350"
  | "400"
  | "450"
  | "500"
  | "550"
  | "600"
  | "650"
  | "700"
  | "750"
  | "800";

const gapToRem: Record<Gap, string> = {
  "0": "0",
  "050": "0.125rem",
  "100": "0.25rem",
  "150": "0.375rem",
  "200": "0.5rem",
  "250": "0.625rem",
  "300": "0.75rem",
  "350": "0.875rem",
  "400": "1rem",
  "450": "1.125rem",
  "500": "1.25rem",
  "550": "1.375rem",
  "600": "1.5rem",
  "650": "1.625rem",
  "700": "1.75rem",
  "750": "1.875rem",
  "800": "2rem",
};

type BlockStackProps = {
  gap?: Gap;
  align?: Align;
  inlineAlign?: InlineAlign;
  children: ReactNode;
};
const BlockStack = (props: BlockStackProps) => {
  return (
    <div
      className="block-stack"
      style={{
        gap: gapToRem[props.gap || "0"],
        justifyContent: props.align || "flex-start",
        alignItems: props.inlineAlign || "stretch",
      }}
    >
      {props.children}
    </div>
  );
};

export default BlockStack;
