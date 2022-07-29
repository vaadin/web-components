/**
 * @license
 * Copyright (c) 2018 - 2021 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
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
