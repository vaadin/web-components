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
import { Details } from '@vaadin/details/src/vaadin-details.js';

/**
 * @deprecated Import `Details` from `@vaadin/details` instead.
 */
export const DetailsElement = Details;

export * from '@vaadin/details/src/vaadin-details.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-details" is deprecated. Use "@vaadin/details" instead.');
