/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
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
