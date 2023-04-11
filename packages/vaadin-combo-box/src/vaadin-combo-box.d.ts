/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
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
