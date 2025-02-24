import { Fragment, useState } from "react";
import Card from "../layout/card";
import RuleRow from "../rule-row";
import {
  RuleInputValue,
  RuleType,
  ruleTypesByOrder,
  RuleTypesConfig,
  Operator,
} from "@/lib/constants/rule-types";
import {
  isMutuallyExclusiveWithAnyOtherRule,
  removeMutuallyExclusiveOperators,
  sortRulesByRuleTypes,
} from "@/lib/utils";
import BlockStack from "../layout/block-stack";

export type Rule = {
  id: string;
  ruleType: RuleType;
  operator: Operator;
  value?: RuleInputValue;
};

const RulesSelector = () => {
  const [rules, setRules] = useState<Rule[]>(() => {
    const ruleType = RuleType.SPECIFIC_PRODUCTS;
    const operators = RuleTypesConfig[ruleType].operators;
    const initialOperator = Object.keys(operators)[0] as Operator;
    return [
      {
        id: String(Date.now()),
        ruleType: ruleType,
        operator: initialOperator as Operator,
        value: operators[initialOperator]!.config.defaultValue,
      },
    ];
  });

  const ruleTypesInUse = rules.map((rule) => rule.ruleType);
  const availableRules = ruleTypesByOrder.filter(
    (ruleType) => !ruleTypesInUse.includes(ruleType)
  ) as RuleType[];

  const addNewRule = () => {
    const operatorsForFirstAvailableRule =
      RuleTypesConfig[availableRules[0]].operators;

    let defaultOperator = removeMutuallyExclusiveOperators(
      rules,
      RuleTypesConfig[availableRules[0]]
    )[0];

    setRules((rules) =>
      sortRulesByRuleTypes([
        ...rules,
        {
          id: String(Date.now()),
          ruleType: availableRules[0],
          operator: defaultOperator,
          value:
            operatorsForFirstAvailableRule[defaultOperator]?.config
              .defaultValue,
        },
      ])
    );
  };

  return (
    <BlockStack gap="400">
      <Card>
        <BlockStack gap="400">
          <BlockStack gap="100">
            <h2 className="heading heading-sm">Rule</h2>
            <p className="para">
              The offer will be triggered based on the rules in this section
            </p>
          </BlockStack>
          <hr className="divider"></hr>
          <BlockStack gap="400">
            <BlockStack gap="200">
              <p className="para">Show offer if</p>
              <div className="rule-list">
                {rules.map((rule, i) => (
                  <Fragment key={rule.id}>
                    <RuleRow
                      rule={rule}
                      setRules={setRules}
                      key={rule.id}
                      ruleTypesInUse={ruleTypesInUse}
                      isSingleRule={rules.length === 1}
                      isMutuallyExclusive={isMutuallyExclusiveWithAnyOtherRule(
                        RuleTypesConfig[rule.ruleType],
                        rules
                      )}
                    />
                    {i < rules.length - 1 ? (
                      <span className="rule-row-join">AND</span>
                    ) : null}
                  </Fragment>
                ))}
              </div>
            </BlockStack>

            {availableRules.length > 0 ? (
              <BlockStack inlineAlign="center">
                <button onClick={addNewRule} className="btn">
                  + AND
                </button>
              </BlockStack>
            ) : null}
          </BlockStack>
        </BlockStack>
      </Card>
      <Card>
        <pre>{JSON.stringify(rules, null, 4)}</pre>
      </Card>
    </BlockStack>
  );
};

export default RulesSelector;
