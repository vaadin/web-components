/**
 * @license
 * Copyright (c) 2021 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Icon } from '@vaadin/icon/src/vaadin-icon.js';

/**
 * @deprecated Import `Icon` from `@vaadin/icon` instead.
 */
export const IconElement = Icon;

export * from '@vaadin/icon/src/vaadin-icon.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-icon" is deprecated. Use "@vaadin/icon" instead.');
