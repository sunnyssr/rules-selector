import Select from "../forms/select";
import RuleValueInput from "./components/rule-value-input";
import {
  removeMutuallyExclusiveOperators,
  sortRulesByRuleTypes,
} from "@/lib/utils";
import {
  RuleTypesConfig,
  RuleTypeLabels,
  RuleType,
  ruleTypeGroups,
  Operator,
  OperatorLabels,
  InputTypes,
  RuleInputProductValue,
  RuleInputCollectionValue,
} from "@/lib/constants/rule-types";
import { type Rule } from "../rules-selector";
import "./rule-row.css";
import TagList from "../forms/tag-list/tag-list";
import { XIcon } from "../common/icons";

type RuleRowProps = {
  rule: Rule;
  setRules: React.Dispatch<React.SetStateAction<Rule[]>>;
  ruleTypesInUse: RuleType[];
  isMutuallyExclusive: boolean;
  isSingleRule?: boolean;
};

const RuleRow = (props: RuleRowProps) => {
  const ruleConfig = RuleTypesConfig[props.rule.ruleType];

  const updateRule = (update: Partial<Rule>) => {
    if (!update.ruleType) {
      update.ruleType = props.rule.ruleType;
    }
    const newRuleTypeConfig = RuleTypesConfig[update.ruleType];

    props.setRules((rules) => {
      const operatorsAvailableForNewRuleType = removeMutuallyExclusiveOperators(
        rules,
        newRuleTypeConfig
      );
      if (update.ruleType && update.ruleType !== props.rule.ruleType) {
        // Rule type was changed
        if (!operatorsAvailableForNewRuleType.includes(props.rule.operator)) {
          // Check if current selected operator is not supported by new rule type
          update.operator = operatorsAvailableForNewRuleType[0];
        }
        // set default value according to latest operator since rule type is changed
        update.value =
          newRuleTypeConfig.operators[
            update.operator || props.rule.operator
          ]?.config.defaultValue;
      }

      if (update.operator && update.operator !== props.rule.operator) {
        // Operator was changed
        if (
          update.ruleType === props.rule.ruleType &&
          newRuleTypeConfig.operators[update.operator]?.type ===
            newRuleTypeConfig.operators[props.rule.operator]?.type
        ) {
          // RuleType is same
          // Input type for both operator is same
          // Do nothing
        } else {
          update.value =
            newRuleTypeConfig.operators[update.operator]?.config.defaultValue;
        }
      }

      const updatedRules = rules.map((rule) =>
        rule.id === props.rule.id ? { ...rule, ...update } : rule
      );
      if (update.ruleType !== props.rule.ruleType) {
        // Sort the rules array since ruleType is changed
        return sortRulesByRuleTypes(updatedRules);
      }
      return updatedRules;
    });
  };

  const deleteRule = () => {
    props.setRules((rules) =>
      rules.filter((rule) => rule.id !== props.rule.id)
    );
  };

  const operatorsForSelectedRuleType = ruleConfig.operators;
  const selectedOperatorInputConfig =
    operatorsForSelectedRuleType[props.rule.operator];

  return (
    <div className="rule-row">
      <div>
        <div className="rule-row-form">
          <Select
            value={props.rule.ruleType}
            options={ruleTypeGroups.map((ruleTypeGroup) => ({
              title: ruleTypeGroup.groupTitle,
              options: ruleTypeGroup.options.map((ruleType) => ({
                label: RuleTypeLabels[ruleType],
                value: ruleType,
                disabled:
                  props.ruleTypesInUse.includes(ruleType) &&
                  props.rule.ruleType !== ruleType,
              })),
            }))}
            onChange={(value) => updateRule({ ruleType: value as RuleType })}
          />

          {operatorsForSelectedRuleType.DEFAULT ? null : (
            <Select
              value={props.rule.operator ?? undefined}
              options={
                operatorsForSelectedRuleType
                  ? Object.keys(operatorsForSelectedRuleType).map(
                      (operator) => ({
                        label: OperatorLabels[operator as Operator],
                        value: operator,
                        disabled:
                          props.isMutuallyExclusive &&
                          operator === Operator.CONTAINS_ANY,
                      })
                    )
                  : []
              }
              onChange={(value) => updateRule({ operator: value as Operator })}
            />
          )}
          {props.rule.operator !== Operator.EQUALS_ANYTHING ? (
            <RuleValueInput
              ruleType={props.rule.ruleType}
              operator={props.rule.operator}
              value={props.rule.value}
              updateRule={updateRule}
            />
          ) : null}
        </div>
        {props.isSingleRule ? null : (
          <button className="rule-row-delete-button" onClick={deleteRule}>
            <XIcon className="rule-row-delete-icon" />
          </button>
        )}
      </div>

      {selectedOperatorInputConfig?.type === InputTypes.RESOURCE_SELECT ? (
        <TagList
          tags={(props.rule.value as ResourceValue).map((resource) => {
            return (
              (resource as any).productName ||
              (resource as any).collectionName ||
              resource
            );
          })}
          onRemove={(id) => {
            updateRule({
              value: (props.rule.value as ResourceValue)?.filter(
                (resource) =>
                  ((resource as any)?.productName ||
                    (resource as any)?.collectionName ||
                    resource) !== id
              ) as ResourceValue,
            });
          }}
        />
      ) : null}
    </div>
  );
};

export default RuleRow;

type ResourceValue =
  | string[]
  | RuleInputProductValue[]
  | RuleInputCollectionValue[];
