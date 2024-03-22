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
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay.js';

/**
 * @deprecated Import `Overlay` from `@vaadin/overlay` instead.
 */
export const OverlayElement = Overlay;

export * from '@vaadin/overlay/src/vaadin-overlay.js';

console.warn('WARNING: Since Vaadin 23.3, "@vaadin/vaadin-overlay" is deprecated. Use "@vaadin/overlay" instead.');
