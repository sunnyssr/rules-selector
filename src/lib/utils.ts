import { Rule } from "../components/rules-selector";
import {
  Operator,
  RuleTypeConfig,
  ruleTypesByOrder,
} from "./constants/rule-types";

export const sortRulesByRuleTypes = (rules: Rule[]) => {
  return [...rules].sort(
    (a, b) =>
      ruleTypesByOrder.indexOf(a.ruleType) -
      ruleTypesByOrder.indexOf(b.ruleType)
  );
};
export const isMutuallyExclusiveWithAnyOtherRule = (
  ruleConfig: RuleTypeConfig,
  rules: Rule[]
) => {
  if (ruleConfig.mutuallyExclusiveWith) {
    const possiblyConflictingRules = rules.filter((rule) =>
      ruleConfig.mutuallyExclusiveWith?.includes(rule.ruleType)
    );
    return possiblyConflictingRules.some(
      (rule) => rule.operator === Operator.CONTAINS_ANY
    );
  }
  return false;
};

export const removeMutuallyExclusiveOperators = (
  rules: Rule[],
  ruleConfig: RuleTypeConfig
) => {
  if (ruleConfig.mutuallyExclusiveWith) {
    const possiblyConflictingRules = rules.filter((rule) =>
      ruleConfig.mutuallyExclusiveWith?.includes(rule.ruleType)
    );
    const isAnyExistingRuleConflicting = possiblyConflictingRules.some(
      (rule) => rule.operator === Operator.CONTAINS_ANY
    );
    if (isAnyExistingRuleConflicting) {
      // If exclusive with any existing rule, then remove contains_any
      return Object.keys(ruleConfig.operators).filter(
        (operator) => operator !== Operator.CONTAINS_ANY
      ) as Operator[];
    }
  }
  return Object.keys(ruleConfig.operators) as Operator[];
};
