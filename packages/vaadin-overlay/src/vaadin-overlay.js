/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';

/**
 * @deprecated Import `Overlay` from `@vaadin/overlay` instead.
 */
export const OverlayElement = Overlay;

export * from '@vaadin/overlay/src/vaadin-overlay.js';

console.warn('WARNING: Since Vaadin 23.3, "@vaadin/vaadin-overlay" is deprecated. Use "@vaadin/overlay" instead.');
