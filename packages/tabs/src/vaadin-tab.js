/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ItemMixin } from '@vaadin/item/src/vaadin-item-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-tab>` is a Web Component providing an accessible and customizable tab.
 *
 * ```
 *   <vaadin-tab>
 *     Tab 1
 *   </vaadin-tab>
 * ```
 *
 * The following state attributes are available for styling:
 *
 * Attribute  | Description | Part name
 * -----------|-------------|------------
 * `disabled` | Set to a disabled tab | :host
 * `focused` | Set when the element is focused | :host
 * `focus-ring` | Set when the element is keyboard focused | :host
 * `selected` | Set when the tab is selected | :host
 * `active` | Set when mousedown or enter/spacebar pressed | :host
 * `orientation` | Set to `horizontal` or `vertical` depending on the direction of items  | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ThemableMixin
 * @mixes ItemMixin
 */
class Tab extends ElementMixin(ThemableMixin(ItemMixin(PolymerElement))) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none !important;
        }
      </style>
      <slot></slot>
    `;
  }

  static get is() {
    return 'vaadin-tab';
  }

  /** @protected */
  ready() {
    super.ready();
    this.setAttribute('role', 'tab');
  }

  /**
   * Override an event listener from `KeyboardMixin`
   * to handle clicking anchors inside the tabs.
   * @param {!KeyboardEvent} event
   * @protected
   * @override
   */
  _onKeyUp(event) {
    const willClick = this.hasAttribute('active');

    super._onKeyUp(event);

    if (willClick) {
      const anchor = this.querySelector('a');
      if (anchor) {
        anchor.click();
      }
    }
  }
}

customElements.define(Tab.is, Tab);

export { Tab };
