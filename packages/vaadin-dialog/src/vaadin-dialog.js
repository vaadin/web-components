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
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';

/**
 * @deprecated Import `Dialog` from `@vaadin/dialog` instead.
 */
export const DialogElement = Dialog;

export * from '@vaadin/dialog/src/vaadin-dialog.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-dialog" is deprecated. Use "@vaadin/dialog" instead.');
