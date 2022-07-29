/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { Dialog } from '@vaadin/dialog/src/vaadin-dialog.js';

/**
 * @deprecated Import `Dialog` from `@vaadin/dialog` instead.
 */
export const DialogElement = Dialog;

export * from '@vaadin/dialog/src/vaadin-dialog.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-dialog" is deprecated. Use "@vaadin/dialog" instead.');
