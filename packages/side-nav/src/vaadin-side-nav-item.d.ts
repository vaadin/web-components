/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

declare class SideNavItem extends ItemMixin(ElementMixin(ThemableMixin(PolylitMixin(LitElement)))) {
  path: string;

  expanded: boolean;

  active: boolean;
}

declare global {
  interface HTMLElementTagNameMap {
    'vaadin-side-nav-item': SideNavItem;
  }
}

export { SideNavItem };
