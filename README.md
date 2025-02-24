# Rules Selector

### Rules detail & priority order

1. Specific collections (collection is a group of products) mutually exclusive with Specific products
   1. contains any
   2. is not
2. product tags (labels or attributes that can be assigned to products)
   1. contains any
   2. is not
3. Specific products mutually exclusive with Specific collections
   1. equals anything (DEFAULT)
   2. contains any
   3. is not
4. Product subscribed (checks whether a product added to the cart is part of a subscription plan)
   1. yes
   2. no
5. Specific discount codes (specify promotional codes that customers must use to qualify for an offer⁠)
6. Cart value range (customer's total purchase amount)
   1. is equal or greater than
   2. is between
   3. is less than
