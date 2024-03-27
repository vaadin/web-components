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
import { Select } from '@vaadin/select/src/vaadin-select.js';

/**
 * @deprecated Import `Select` from `@vaadin/select` instead.
 */
export const SelectElement = Select;

export * from '@vaadin/select/src/vaadin-select.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-select" is deprecated. Use "@vaadin/select" instead.');
