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
import { ConfirmDialog } from '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';

/**
 * @deprecated Import `ConfirmDialog` from `@vaadin/confirm-dialog` instead.
 */
export const ConfirmDialogElement = ConfirmDialog;

export * from '@vaadin/confirm-dialog/src/vaadin-confirm-dialog.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-confirm-dialog" is deprecated. Use "@vaadin/confirm-dialog" instead.',
);
