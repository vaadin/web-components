/**
 * @license
 * Copyright (c) 2017 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { itemStyles } from '@vaadin/item/src/styles/vaadin-item-base-styles.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { LumoInjectionMixin } from '@vaadin/vaadin-themable-mixin/lumo-injection-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-select-item>` is a Web Component providing layout for items in the
 * `<vaadin-select-list-box>` that is slotted into the `<vaadin-select>` overlay.
 *
 * ```html
 * <vaadin-select-item value="foo">Foo</vaadin-select-item>
 * ```
 *
 * It has the same API as [`<vaadin-item>`](#/elements/vaadin-item), and should
 * be preferred over it for items placed directly inside `<vaadin-select>`.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement vaadin-select-item
 * @extends HTMLElement
 */
class SelectItem extends ItemMixin(ThemableMixin(DirMixin(PolylitMixin(LumoInjectionMixin(LitElement))))) {
  static get is() {
    return 'vaadin-select-item';
  }

  static get styles() {
    return itemStyles;
  }

  static get properties() {
    return {
      /**
       * Use property instead of setting an attribute in `ready()`
       * for cloning the selected item attached to the value button:
       * in this case, `role` attribute is removed synchronously, and
       * using `ready()` would incorrectly restore the attribute.
       *
       * @protected
       */
      role: {
        type: String,
        value: 'option',
        reflectToAttribute: true,
      },
    };
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
}

defineCustomElement(SelectItem);

export { SelectItem };
