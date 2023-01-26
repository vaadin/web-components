/**
 * @license
 * Copyright (c) 2020 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-avatar-group>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @protected
 */
class AvatarGroupMenuItem extends ItemMixin(ThemableMixin(DirMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-avatar-group-menu-item';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
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

customElements.define(AvatarGroupMenuItem.is, AvatarGroupMenuItem);

export { AvatarGroupMenuItem };
