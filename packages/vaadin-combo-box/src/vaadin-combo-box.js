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
import { ComboBox } from '@vaadin/combo-box/src/vaadin-combo-box.js';

/**
 * @deprecated Import `ComboBox` from `@vaadin/combo-box` instead.
 */
export const ComboBoxElement = ComboBox;

export * from '@vaadin/combo-box/src/vaadin-combo-box.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-combo-box" is deprecated. Use "@vaadin/combo-box" instead.');
