import "./input.css";

type InputProps = {
  type?: "number" | "string";
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: number;
};
const Input = (props: InputProps) => {
  return (
    <div className="form-input">
      <input
        type={props.type || "text"}
        value={props.value}
        min={props.min ?? undefined}
        step={props.step ?? undefined}
        onChange={(e) => {
          props.setValue(e.target.value);
        }}
        placeholder={props.placeholder || undefined}
      />
      <div className="form-input-backdrop"></div>
    </div>
  );
};

export default Input;
