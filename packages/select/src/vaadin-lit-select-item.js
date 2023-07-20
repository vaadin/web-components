/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { css, html, LitElement } from 'lit';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectItem extends ItemMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-select-item';
  }

  static get styles() {
    return css`
      :host {
        display: inline-block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
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

    this.setAttribute('role', 'option');
  }
}

customElements.define(SelectItem.is, SelectItem);

export { SelectItem };
