import {
  RuleInputCollectionValue,
  RuleInputProductValue,
  RuleInputValue,
} from "@/lib/constants/rule-types";
import { collections, products, productTags } from "@/lib/sample-data";
import MultiSelect from "@/components/forms/multi-select";

type ResourceType = "collection" | "product" | "product_tag";
type ResourceSelectInputProps = {
  resourceType: ResourceType;
  multiple: boolean;
  value: RuleInputValue;
  setValue: (value: RuleInputValue) => void;
};

const ResourceSelectInput = (props: ResourceSelectInputProps) => {
  const resourceDetails = getResourceDetails(
    props.resourceType,
    props.value,
    props.setValue
  );
  if (!resourceDetails) return null;
  const { placeholder, options, value, setValue } = resourceDetails;
  return (
    <MultiSelect
      selectedValues={value}
      setSelectedValues={setValue}
      placeholder={placeholder}
      options={options}
    />
  );
};

export default ResourceSelectInput;

const getResourceDetails = (
  resourceType: ResourceType,
  value: RuleInputValue,
  setValue: (value: RuleInputValue) => void
) => {
  if (resourceType === "product_tag") {
    return {
      value: value as string[],
      placeholder: "Search product tags",
      options: productTags.map((productTag) => ({
        label: productTag,
        value: productTag,
      })),
      setValue: setValue,
    };
  }

  if (resourceType === "product") {
    const productLookupTable = products.reduce((lookup, product) => {
      lookup[String(product.id)] = product;
      return lookup;
    }, {} as Record<string, (typeof products)[0]>);

    return {
      value: (value as RuleInputProductValue[]).map((value) => value.productId),
      placeholder: "Search products",
      options: products.map((product) => ({
        label: product.title,
        value: String(product.id),
      })),
      setValue: (selectedValues: string[]) => {
        setValue(
          selectedValues.map((productId): RuleInputProductValue => {
            const product = productLookupTable[productId];
            return {
              noOfVariants: product.variants.length,
              productId: String(productId),
              productName: product.title,
            };
          })
        );
      },
    };
  }

  if (resourceType === "collection") {
    const collectionLookupTable = collections.reduce((lookup, collection) => {
      lookup[String(collection.id)] = collection;
      return lookup;
    }, {} as Record<string, (typeof collections)[0]>);

    return {
      value: (value as RuleInputCollectionValue[]).map(
        (value) => value.collectionId
      ),
      placeholder: "Search collections",
      options: collections.map((collection) => ({
        label: collection.title,
        value: String(collection.id),
      })),
      setValue: (selectedValues: string[]) => {
        setValue(
          selectedValues.map((colllectionId): RuleInputCollectionValue => {
            const collection = collectionLookupTable[colllectionId];
            return {
              collectionId: colllectionId,
              collectionName: collection.title,
            };
          })
        );
      },
    };
  }

  return null;
};
