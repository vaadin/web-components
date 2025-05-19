/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { itemStyles } from '@vaadin/item/src/vaadin-item-core-styles.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

registerStyles('vaadin-select-item', itemStyles, { moduleId: 'vaadin-select-item-styles' });

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes DirMixin
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @protected
 */
class SelectItem extends ItemMixin(ThemableMixin(DirMixin(PolymerElement))) {
  static get is() {
    return 'vaadin-select-item';
  }

  static get template() {
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

defineCustomElement(SelectItem);

export { SelectItem };
