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
import { MenuBar } from '@vaadin/menu-bar/src/vaadin-menu-bar.js';

/**
 * @deprecated Import `MenuBar` from `@vaadin/menu-bar` instead.
 */
export const MenuBarElement = MenuBar;

export * from '@vaadin/menu-bar/src/vaadin-menu-bar.js';

console.warn('WARNING: Since Vaadin 23.2, "@vaadin/vaadin-menu-bar" is deprecated. Use "@vaadin/menu-bar" instead.');
