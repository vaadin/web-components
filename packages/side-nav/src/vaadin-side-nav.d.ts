/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-side-nav>` is a Web Component for navigation menus.
 */
declare class SideNav extends ElementMixin(ThemableMixin(PolylitMixin(LitElement))) {}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-side-nav': SideNav;
  }
}

export { SideNav };
