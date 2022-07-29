/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Accordion } from '@vaadin/accordion/src/vaadin-accordion.js';

/**
 * @deprecated Import `Accordion` from `@vaadin/accordion` instead.
 */
export const AccordionElement = Accordion;

export * from '@vaadin/accordion/src/vaadin-accordion.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-accordion" is deprecated. Use "@vaadin/accordion" instead.');
