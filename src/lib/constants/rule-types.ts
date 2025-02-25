export enum RuleType {
  SPECIFIC_COLLECTIONS = "SPECIFIC_COLLECTIONS",
  SPECIFIC_PRODUCTS = "SPECIFIC_PRODUCTS",
  PRODUCT_TAGS = "PRODUCT_TAGS",
  PRODUCT_SUBSCRIBED = "PRODUCT_SUBSCRIBED",
  CART_VALUE_RANGE = "CART_VALUE_RANGE",
  SPECIFIC_DISCOUNT_CODES = "SPECIFIC_DISCOUNT_CODES",
}

export enum InputTypes {
  RESOURCE_SELECT = "RESOURCE_SELECT",
  BOOLEAN = "BOOLEAN",
  NUMBER = "NUMBER",
  NUMBER_RANGE = "NUMBER_RANGE",
  TEXT = "TEXT",
}

export enum Operator {
  CONTAINS_ANY = "CONTAINS_ANY",
  IS_NOT = "IS_NOT",
  EQUALS_ANYTHING = "EQUALS_ANYTHING",
  GREATER_THAN_OR_EQUAL = "GREATER_THAN_OR_EQUAL",
  BETWEEN = "BETWEEN",
  LESS_THAN = "LESS_THAN",
  DEFAULT = "DEFAULT",
}

export type RuleInputProductValue = {
  productId: string;
  productName: string;
  noOfVariants: number;
};
export type RuleInputCollectionValue = {
  collectionId: string;
  collectionName: string;
};
export type RuleInputRange = { min: number; max: number };

export type RuleInputValue =
  | boolean
  | string
  | number
  | string[] // for product tags
  | RuleInputRange
  | RuleInputProductValue[]
  | RuleInputCollectionValue[];

type InputConfig = {
  type: InputTypes;
  config: {
    resourceType?: "collection" | "product" | "product_tag"; // should be present in case of resource_select type
    multiple?: boolean;
    defaultValue?: RuleInputValue;
    min?: number;
    step?: number;
  };
};

export type RuleTypeConfig = {
  operators: {
    [K in Operator]?: InputConfig;
  };
  mutuallyExclusiveWith?: RuleType[];
};

export const RuleTypesConfig: Record<RuleType, RuleTypeConfig> = {
  SPECIFIC_COLLECTIONS: {
    operators: {
      CONTAINS_ANY: {
        type: InputTypes.RESOURCE_SELECT,
        config: {
          resourceType: "collection",
          multiple: true,
          defaultValue: [],
        },
      },
      IS_NOT: {
        type: InputTypes.RESOURCE_SELECT,
        config: {
          resourceType: "collection",
          multiple: true,
          defaultValue: [],
        },
      },
    },
    mutuallyExclusiveWith: [RuleType.SPECIFIC_PRODUCTS],
  },

  SPECIFIC_DISCOUNT_CODES: {
    operators: {
      DEFAULT: {
        type: InputTypes.TEXT,
        config: {
          defaultValue: "",
        },
      },
    },
  },

  PRODUCT_TAGS: {
    operators: {
      CONTAINS_ANY: {
        type: InputTypes.RESOURCE_SELECT,
        config: {
          resourceType: "product_tag",
          multiple: true,
          defaultValue: [],
        },
      },
      IS_NOT: {
        type: InputTypes.RESOURCE_SELECT,
        config: {
          resourceType: "product_tag",
          multiple: true,
          defaultValue: [],
        },
      },
    },
  },

  SPECIFIC_PRODUCTS: {
    operators: {
      EQUALS_ANYTHING: {
        type: InputTypes.BOOLEAN,
        config: {
          defaultValue: true,
        },
      },

      CONTAINS_ANY: {
        type: InputTypes.RESOURCE_SELECT,
        config: {
          resourceType: "product",
          multiple: true,
          defaultValue: [],
        },
      },
      IS_NOT: {
        type: InputTypes.RESOURCE_SELECT,
        config: {
          resourceType: "product",
          multiple: true,
          defaultValue: [],
        },
      },
    },
    mutuallyExclusiveWith: [RuleType.SPECIFIC_COLLECTIONS],
  },

  PRODUCT_SUBSCRIBED: {
    operators: {
      DEFAULT: {
        type: InputTypes.BOOLEAN,
        config: {
          defaultValue: true,
        },
      },
    },
  },

  CART_VALUE_RANGE: {
    operators: {
      GREATER_THAN_OR_EQUAL: {
        type: InputTypes.NUMBER,
        config: {
          defaultValue: 0.99,
          step: 0.1,
          min: 0,
        },
      },
      LESS_THAN: {
        type: InputTypes.NUMBER,
        config: {
          defaultValue: 2.99,
          step: 0.1,
          min: 0,
        },
      },
      BETWEEN: {
        type: InputTypes.NUMBER_RANGE,
        config: {
          defaultValue: { min: 0, max: 1 } as RuleInputRange,
          step: 0.1,
          min: 0,
        },
      },
    },
  },
};

export const OperatorLabels: Record<Operator, string> = {
  [Operator.CONTAINS_ANY]: "Contains any",
  [Operator.IS_NOT]: "Is not",
  [Operator.EQUALS_ANYTHING]: "Equals anything",
  [Operator.GREATER_THAN_OR_EQUAL]: "Is equal or greater than",
  [Operator.BETWEEN]: "Between",
  [Operator.LESS_THAN]: "Is less than",
  [Operator.DEFAULT]: "Default",
};

export const RuleTypeLabels: Record<RuleType, string> = {
  [RuleType.SPECIFIC_COLLECTIONS]: "Specific collections",
  [RuleType.SPECIFIC_PRODUCTS]: "Specific products",
  [RuleType.PRODUCT_TAGS]: "Product tags",
  [RuleType.PRODUCT_SUBSCRIBED]: "Product subscribed",
  [RuleType.SPECIFIC_DISCOUNT_CODES]: "Specific discount codes",
  [RuleType.CART_VALUE_RANGE]: "Cart value range",
};

export const ruleTypeGroups = [
  {
    groupTitle: "Products",
    options: [
      RuleType.SPECIFIC_COLLECTIONS,
      RuleType.PRODUCT_TAGS,
      RuleType.SPECIFIC_PRODUCTS,
      RuleType.PRODUCT_SUBSCRIBED,
    ],
  },
  { groupTitle: "Orders", options: [RuleType.CART_VALUE_RANGE] },
  {
    groupTitle: "Discount code",
    options: [RuleType.SPECIFIC_DISCOUNT_CODES],
  },
];

export const ruleTypesByOrder = ruleTypeGroups
  .map((group) => group.options)
  .flat();
