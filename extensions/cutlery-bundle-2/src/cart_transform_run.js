// @ts-check

/**
 * @typedef {import("../generated/api").CartTransformRunInput} CartTransformRunInput
 * @typedef {import("../generated/api").CartTransformRunResult} CartTransformRunResult
 * @typedef {import("../generated/api").Operation} Operation
 */

/**
 * @type {CartTransformRunResult}
 */
const NO_CHANGES = {
  operations: [],
};

/**
 * @param {CartTransformRunInput} input
 * @returns {CartTransformRunResult}
 */
export function cartTransformRun(input) {
  /** @type {Operation[]} */
  const operations = input.cart.lines.reduce(
    (acc, cartLine) => {
      const expandOperation = optionallyBuildExpandOperation(cartLine);

      if (expandOperation) {
        return [...acc, { lineExpand: expandOperation }];
      }

      return acc;
    },
    /** @type {Operation[]} */ ([])
  );

  return operations.length > 0 ? { operations } : NO_CHANGES;
}

/**
 * @param {CartTransformRunInput['cart']['lines'][number]} cartLine
 */
function optionallyBuildExpandOperation(cartLine) {
  const { id, merchandise } = cartLine;

  const TARGET_VARIANT_ID = "gid://shopify/ProductVariant/47803843313899";
  const BUNDLE_VARIANTS = [
    "gid://shopify/ProductVariant/47330424848619",
    "gid://shopify/ProductVariant/47330342404331", 
    "gid://shopify/ProductVariant/47330342306027"
  ];

  if (
    merchandise.__typename === "ProductVariant" &&
    merchandise.id === TARGET_VARIANT_ID
  ) {
    return {
      cartLineId: id,
      title: "Cutlery Bundle",
      expandedCartItems: BUNDLE_VARIANTS.map((variantId) => ({
        merchandiseId: variantId,
        quantity: 1,
      })),
    };
  }

  return null;
}
