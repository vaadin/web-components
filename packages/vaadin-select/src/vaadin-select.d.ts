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
import type { Select } from '@vaadin/select/src/vaadin-select.js';

/**
 * @deprecated Import `Select` from `@vaadin/select` instead.
 */
export type SelectElement = Select;

/**
 * @deprecated Import `Select` from `@vaadin/select` instead.
 */
export const SelectElement: typeof Select;

export * from '@vaadin/select/src/vaadin-select.js';
