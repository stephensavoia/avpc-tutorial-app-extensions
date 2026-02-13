// @ts-check

/**
 * @typedef {import("../generated/api").CartTransformRunInput} CartTransformRunInput
 * @typedef {import("../generated/api").CartTransformRunResult} CartTransformRunResult
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
  const TARGET_VARIANT_ID = "gid://shopify/ProductVariant/47803843313899";
  const BUNDLE_VARIANTS = [
    "gid://shopify/ProductVariant/47330424848619",
    "gid://shopify/ProductVariant/47330342404331", 
    "gid://shopify/ProductVariant/47330342306027"
  ];
  
  // Find cart lines with the target variant ID
  const targetLines = input.cart.lines.filter(line => {
    return line.merchandise.__typename === "ProductVariant" && 
           line.merchandise.id === TARGET_VARIANT_ID;
  });
  console.log("THIS RANGER");
  if (targetLines.length === 0) {
    return NO_CHANGES;
  }
  
  // Create operations to expand each target line into bundle components
  const operations = targetLines.map(targetLine => {
    // Create expanded cart items for each bundle variant
    // Each variant gets the same quantity as the target line
    console.log(`Expanding line ${targetLine.id} with quantity ${targetLine.quantity}`);
    const expandedCartItems = BUNDLE_VARIANTS.map(variantId => ({
      merchandiseId: variantId,
      quantity: 1
    }));
    
    return {
      lineExpand: {
        cartLineId: targetLine.id,
        expandedCartItems: expandedCartItems,
        title: "Cutlery Bundle"
      }
    };
  });
  
  return {
    operations
  }; 
};