import {
  InputTypes,
  RuleInputValue,
  RuleType,
  RuleTypesConfig,
  Operator,
  RuleInputRange,
} from "@/lib/constants/rule-types";
import Input from "@/components/forms/input";
import Select from "@/components/forms/select";
import { Rule } from "@/components/rules-selector";
import ResourceSelectInput from "./resource-select-input";

type RuleValueInputProps = {
  ruleType: RuleType;
  operator: Operator;
  value?: RuleInputValue;
  updateRule: (update: Partial<Rule>) => void;
};

const RuleValueInput = (props: RuleValueInputProps) => {
  const operatorsForSelectedRuleType =
    RuleTypesConfig[props.ruleType].operators;

  const selectedOperatorInputConfig =
    operatorsForSelectedRuleType[props.operator];

  const setValue = (value: RuleInputValue) => {
    props.updateRule({ value });
  };

  switch (selectedOperatorInputConfig?.type) {
    case InputTypes.RESOURCE_SELECT:
      return (
        <ResourceSelectInput
          resourceType={selectedOperatorInputConfig.config.resourceType!}
          value={props.value!}
          setValue={setValue}
          multiple={true}
        />
      );

    case InputTypes.BOOLEAN:
      return (
        <Select
          value={props.value ? "yes" : "no"}
          options={[
            { label: "Yes", value: "yes" },
            { label: "No", value: "no" },
          ]}
          onChange={(value) => setValue(value === "yes" ? true : false)}
        />
      );

    case InputTypes.TEXT:
      return <Input value={String(props.value)} setValue={setValue} />;

    case InputTypes.NUMBER:
      return (
        <Input
          type="number"
          value={String(props.value)}
          setValue={(value) => setValue(Number(value))}
          min={selectedOperatorInputConfig.config.min}
          step={selectedOperatorInputConfig.config.step}
        />
      );

    case InputTypes.NUMBER_RANGE:
      const range = props.value as RuleInputRange;
      const setRange = (update: Partial<RuleInputRange>) => {
        setValue({
          ...range,
          ...update,
        });
      };
      return (
        <>
          <Input
            type="number"
            value={String(range.min)}
            placeholder="Min"
            setValue={(value) => setRange({ min: Number(value) })}
            min={selectedOperatorInputConfig.config.min}
            step={selectedOperatorInputConfig.config.step}
          />
          <Input
            type="number"
            value={String(range.max)}
            placeholder="Max"
            setValue={(value) => setRange({ max: Number(value) })}
            min={selectedOperatorInputConfig.config.min}
            step={selectedOperatorInputConfig.config.step}
          />
        </>
      );

    default:
      return props.operator;
  }
};

export default RuleValueInput;
