/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ComboBoxDefaultItem } from '@vaadin/combo-box';
import { ComboBox } from '@vaadin/combo-box/src/vaadin-combo-box.js';

/**
 * @deprecated Import `ComboBox` from `@vaadin/combo-box` instead.
 */
export type ComboBoxElement<TItem = ComboBoxDefaultItem> = ComboBox<TItem>;

/**
 * @deprecated Import `ComboBox` from `@vaadin/combo-box` instead.
 */
export const ComboBoxElement: typeof ComboBox;

export * from '@vaadin/combo-box/src/vaadin-combo-box.js';
