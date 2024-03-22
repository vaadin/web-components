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
import type { ComboBoxDefaultItem } from '@vaadin/combo-box';
import type { ComboBoxLight } from '@vaadin/combo-box/src/vaadin-combo-box-light.js';

/**
 * @deprecated Import `ComboBoxLight` from `@vaadin/combo-box/vaadin-combo-box-light` instead.
 */
export type ComboBoxLightElement<TItem = ComboBoxDefaultItem> = ComboBoxLight<TItem>;

/**
 * @deprecated Import `ComboBoxLight` from `@vaadin/combo-box/vaadin-combo-box-light` instead.
 */
export const ComboBoxLightElement: typeof ComboBoxLight;

export * from '@vaadin/combo-box/src/vaadin-combo-box-light.js';
