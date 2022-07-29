/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Select } from '@vaadin/select/src/vaadin-select.js';

/**
 * @deprecated Import `Select` from `@vaadin/select` instead.
 */
export const SelectElement = Select;

export * from '@vaadin/select/src/vaadin-select.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-select" is deprecated. Use "@vaadin/select" instead.');
