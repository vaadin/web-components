/**
 * @license
 * Copyright (c) 2019 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { MenuBar } from '@vaadin/menu-bar/src/vaadin-menu-bar.js';

/**
 * @deprecated Import `MenuBar` from `@vaadin/menu-bar` instead.
 */
export const MenuBarElement = MenuBar;

export * from '@vaadin/menu-bar/src/vaadin-menu-bar.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-menu-bar" is deprecated. Use "@vaadin/menu-bar" instead.');
