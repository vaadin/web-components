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
import { Accordion } from '@vaadin/accordion/src/vaadin-accordion.js';

/**
 * @deprecated Import `Accordion` from `@vaadin/accordion` instead.
 */
export const AccordionElement = Accordion;

export * from '@vaadin/accordion/src/vaadin-accordion.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-accordion" is deprecated. Use "@vaadin/accordion" instead.');
