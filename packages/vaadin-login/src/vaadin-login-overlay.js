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
import { LoginOverlay } from '@vaadin/login/src/vaadin-login-overlay.js';

/**
 * @deprecated Import `LoginOverlay` from `@vaadin/login` instead.
 */
export const LoginOverlayElement = LoginOverlay;

export * from '@vaadin/login/src/vaadin-login-overlay.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-login" is deprecated. Use "@vaadin/login" instead.');
