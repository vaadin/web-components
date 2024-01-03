/**
 * @license
 * Copyright (c) 2017 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ItemMixin } from './vaadin-item-mixin.js';

/**
 * `<vaadin-item>` is a Web Component providing layout for items in tabs and menus.
 *
 * ```
 *   <vaadin-item>
 *     Item content
 *   </vaadin-item>
 * ```
 *
 * ### Selectable
 *
 * `<vaadin-item>` has the `selected` property and the corresponding state attribute.
 * Currently, the component sets the `selected` to false, when `disabled` property is set to true.
 * But other than that, the `<vaadin-item>` does not switch selection by itself.
 * In general, it is the wrapper component, like `<vaadin-list-box>`, which should update
 * the `selected` property on the items, e. g. on mousedown or when Enter / Spacebar is pressed.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name    | Description
 * -------------|----------------
 * `checkmark`  | The graphical checkmark shown for a selected item
 * `content`    | The element that wraps the slot
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `active`     | Set when the item is pressed down, either with mouse, touch or the keyboard.
 * `disabled`   | Set when the item is disabled.
 * `focus-ring` | Set when the item is focused using the keyboard.
 * `focused`    | Set when the item is focused.
 * `selected`   | Set when the item is selected
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/styling-components) documentation.
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ItemMixin
 * @mixes ThemableMixin
 * @mixes DirMixin
 */
class Item extends ItemMixin(ThemableMixin(DirMixin(PolymerElement))) {
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

  static get is() {
    return 'vaadin-item';
  }

  constructor() {
    super();

    /**
     * Submittable string value. The default value is the trimmed text content of the element.
     * @type {string}
     */
    this.value;

    /**
     * String that can be set to visually represent the selected item in `vaadin-select`.
     * @type {string}
     */
    this.label;
  }

  /** @protected */
  ready() {
    super.ready();

    this.setAttribute('role', 'option');
  }
}

defineCustomElement(Item);

export { Item };
