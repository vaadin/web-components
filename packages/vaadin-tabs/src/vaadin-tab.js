/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { ItemMixin } from '@vaadin/vaadin-item/src/vaadin-item-mixin.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';

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
class TabElement extends ElementMixin(ThemableMixin(ItemMixin(PolymerElement))) {
  static get template() {
    return html`<slot></slot>`;
  }

  static get is() {
    return 'vaadin-tab';
  }

  static get version() {
    return '21.0.4';
  }

  ready() {
    super.ready();
    this.setAttribute('role', 'tab');
  }

  /**
   * @param {!KeyboardEvent} event
   * @protected
   */
  _onKeyup(event) {
    const willClick = this.hasAttribute('active');

    super._onKeyup(event);

    if (willClick) {
      const anchor = this.querySelector('a');
      if (anchor) {
        anchor.click();
      }
    }
  }
}

customElements.define(TabElement.is, TabElement);

export { TabElement };
