import { SelectIcon } from "@/components/common/icons";
import "./select.css";

type Option = {
  label: string;
  value: string;
  disabled?: boolean;
};

type OptionGroup = {
  title: string;
  options: Option[];
};

type SelectProps = {
  value?: string;
  onChange?: (changedValue: string) => void;
  options: (Option | OptionGroup)[];
};

const Select = (props: SelectProps) => {
  const selectedOption = getSelectedOption(props.options, props.value || "");

  return (
    <div className="form-select">
      <select
        value={props.value}
        onChange={
          props.onChange
            ? (event) => props.onChange?.(event.currentTarget.value)
            : undefined
        }
      >
        {props.options.map((option) => {
          return isOptionGroup(option) ? (
            <optgroup key={option.title} label={option.title}>
              {option.options.map((nestedOption) => (
                <option
                  key={nestedOption.value}
                  disabled={nestedOption.disabled || undefined}
                  value={nestedOption.value}
                >
                  {nestedOption.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option
              disabled={option.disabled || undefined}
              value={option.value}
              key={option.value}
            >
              {option.label}
            </option>
          );
        })}
      </select>
      <div className="form-select-content">
        <span className="form-select-selected-option">
          {selectedOption?.label}
        </span>
        <SelectIcon className="form-select-icon" />
      </div>
      <div className="form-select-backdrop"></div>
    </div>
  );
};

export default Select;

const isOptionGroup = (option: Option | OptionGroup) => "options" in option;

const getSelectedOption = (
  options: (Option | OptionGroup)[],
  selectedValue: string
) => {
  const flatOptions = options
    .map((option) => (isOptionGroup(option) ? option.options : option))
    .flat();

  let selectedOption = flatOptions.find(
    (option) => option.value === selectedValue
  );

  if (selectedOption === undefined) {
    selectedOption = flatOptions.find((option) => !option.disabled);
  }

  return selectedOption;
};
