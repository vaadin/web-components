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

if (trustedTypes && typeof trustedTypes.createPolicy === 'function') {
  const createPolicy = trustedTypes.createPolicy;
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
  if (trustedTypes && Object.hasOwn(trustedTypes, 'createPolicy')) {
    // `delete` restores the inherited TrustedTypePolicyFactory.prototype.createPolicy method.
    delete trustedTypes.createPolicy;
  }
}

/**
 * Returns the Trusted Types policy created by Highcharts, if any.
 */
export function getHighchartsPolicy() {
  return policy;
}
