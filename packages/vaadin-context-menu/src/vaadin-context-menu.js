/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { ContextMenu } from '@vaadin/context-menu/src/vaadin-context-menu.js';

/**
 * @deprecated Import `ContextMenu` from `@vaadin/context-menu` instead.
 */
export const ContextMenuElement = ContextMenu;

export * from '@vaadin/context-menu/src/vaadin-context-menu.js';

console.warn(
  'WARNING: Since Vaadin 23.2, "@vaadin/vaadin-context-menu" is deprecated. Use "@vaadin/context-menu" instead.',
);
