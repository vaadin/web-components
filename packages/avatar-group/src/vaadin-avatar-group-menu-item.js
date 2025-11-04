/**
 * @license
 * Copyright (c) 2020 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { avatarGroupMenuItemStyles } from './styles/vaadin-avatar-group-menu-item-base-styles.js';

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @protected
 */
class AvatarGroupMenuItem extends ItemMixin(ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-avatar-group-menu-item';
  }

  static get styles() {
    return avatarGroupMenuItemStyles;
  }

  /** @protected */
  render() {
    return html`
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
    `;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'menuitem');
  }
}

defineCustomElement(AvatarGroupMenuItem);

export { AvatarGroupMenuItem };
