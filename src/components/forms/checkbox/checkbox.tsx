import { useId } from "react";
import "./checkbox.css";

type CheckboxProps = {
  checked: boolean;
  setChecked?: (checked: boolean) => void;
  label: string;
};

const Checkbox = (props: CheckboxProps) => {
  const id = useId();
  return (
    <div className="form-checkbox-wrapper">
      <input
        checked={props.checked}
        onChange={(e) => props.setChecked?.(e.target.checked)}
        type="checkbox"
        id={id}
        className="checkbox"
      />
      <label htmlFor={id} className="checkbox-label">
        <span className="checkbox-icon"></span>
        <span className="checkbox-text">{props.label}</span>
      </label>
    </div>
  );
};
export default Checkbox;
