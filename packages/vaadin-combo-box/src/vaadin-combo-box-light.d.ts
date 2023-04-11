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
import { ComboBoxLight } from '@vaadin/combo-box/src/vaadin-combo-box-light.js';

/**
 * @deprecated Import `ComboBoxLight` from `@vaadin/combo-box/vaadin-combo-box-light` instead.
 */
export type ComboBoxLightElement<TItem = ComboBoxDefaultItem> = ComboBoxLight<TItem>;

/**
 * @deprecated Import `ComboBoxLight` from `@vaadin/combo-box/vaadin-combo-box-light` instead.
 */
export const ComboBoxLightElement: typeof ComboBoxLight;

export * from '@vaadin/combo-box/src/vaadin-combo-box-light.js';
