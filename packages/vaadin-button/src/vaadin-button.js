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
import { Button } from '@vaadin/button/src/vaadin-button.js';

/**
 * @deprecated Import `Button` from `@vaadin/button` instead.
 */
export const ButtonElement = Button;

export * from '@vaadin/button/src/vaadin-button.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-button" is deprecated. Use "@vaadin/button" instead.');
