/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { ProgressBar } from '@vaadin/progress-bar/src/vaadin-progress-bar.js';

/**
 * @deprecated Import `ProgressBar` from `@vaadin/progress-bar` instead.
 */
export const ProgressBarElement = ProgressBar;

export * from '@vaadin/progress-bar/src/vaadin-progress-bar.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-progress-bar" is deprecated. Use "@vaadin/progress-bar" instead.',
);
