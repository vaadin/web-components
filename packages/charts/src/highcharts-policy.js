/**
 * @license
 * Copyright (c) 2000 - 2026 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */

// Keeps a reference to the Trusted Types policy that Highcharts creates when it loads, so that
// `highcharts-patches.js` can reuse it. Must be imported before Highcharts.
const { trustedTypes } = window;

let policy;
let createPolicy;
let hasOwnCreatePolicy = false;

if (trustedTypes && typeof trustedTypes.createPolicy === 'function') {
  createPolicy = trustedTypes.createPolicy;
  // A polyfill or another library can define the method on the object itself
  hasOwnCreatePolicy = Object.hasOwn(trustedTypes, 'createPolicy');
  trustedTypes.createPolicy = function (name, rules) {
    const result = createPolicy.call(this, name, rules);
    if (name === 'highcharts' && !policy) {
      policy = result;
    }
    return result;
  };
}

/**
 * Stops listening for new policies. Must be called after Highcharts has loaded.
 */
export function releasePolicyFactory() {
  if (!createPolicy) {
    return;
  }
  if (hasOwnCreatePolicy) {
    trustedTypes.createPolicy = createPolicy;
  } else {
    // `delete` restores the inherited TrustedTypePolicyFactory.prototype.createPolicy method.
    delete trustedTypes.createPolicy;
  }
  createPolicy = undefined;
}

/**
 * Returns the Trusted Types policy created by Highcharts, if any.
 */
export function getHighchartsPolicy() {
  return policy;
}
