/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
