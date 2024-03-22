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
import { Icon } from '@vaadin/icon/src/vaadin-icon.js';

/**
 * @deprecated Import `Icon` from `@vaadin/icon` instead.
 */
export const IconElement = Icon;

export * from '@vaadin/icon/src/vaadin-icon.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-icon" is deprecated. Use "@vaadin/icon" instead.');
