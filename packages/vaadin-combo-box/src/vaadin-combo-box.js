/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBox } from '@vaadin/combo-box/src/vaadin-combo-box.js';

/**
 * @deprecated Import `ComboBox` from `@vaadin/combo-box` instead.
 */
export const ComboBoxElement = ComboBox;

export * from '@vaadin/combo-box/src/vaadin-combo-box.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-combo-box" is deprecated. Use "@vaadin/combo-box" instead.');
