/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Details } from '@vaadin/details/src/vaadin-details.js';

/**
 * @deprecated Import `Details` from `@vaadin/details` instead.
 */
export const DetailsElement = Details;

export * from '@vaadin/details/src/vaadin-details.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-details" is deprecated. Use "@vaadin/details" instead.');
