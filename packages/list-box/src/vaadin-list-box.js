/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { MultiSelectListMixin } from '@vaadin/vaadin-list-mixin/vaadin-multi-select-list-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-list-box>` is a Web Component for creating menus.
 *
 * ```
 *   <vaadin-list-box selected="2">
 *     <vaadin-item>Item 1</vaadin-item>
 *     <vaadin-item>Item 2</vaadin-item>
 *     <vaadin-item>Item 3</vaadin-item>
 *     <vaadin-item>Item 4</vaadin-item>
 *   </vaadin-list-box>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|------------------------
 * `items`           | The items container
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} items-changed - Fired when the `items` property changes.
 * @fires {CustomEvent} selected-changed - Fired when the `selected` property changes.
 * @fires {CustomEvent} selected-values-changed - Fired when the `selectedValues` property changes.
 *
 * @extends HTMLElement
 * @mixes MultiSelectListMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ControllerMixin
 */
class ListBox extends ElementMixin(MultiSelectListMixin(ThemableMixin(ControllerMixin(PolymerElement)))) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='items'] {
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
      </style>
      <div part="items">
        <slot></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-list-box';
  }

  static get properties() {
    return {
      // We don't need to define this property since super default is vertical,
      // but we don't want it to be modified, or be shown in the API docs.
      /** @private */
      orientation: {
        readOnly: true,
      },
    };
  }

  constructor() {
    super();

    /**
     * @type {Element | null}
     * @protected
     */
    // eslint-disable-next-line no-unused-expressions
    this.focused;
  }

  /** @protected */
  ready() {
    super.ready();
    this.setAttribute('role', 'list');

    setTimeout(this._checkImport.bind(this), 2000);
  }

  /**
   * @return {!HTMLElement}
   * @protected
   */
  get _scrollerElement() {
    return this.shadowRoot.querySelector('[part="items"]');
  }

  /** @private */
  _checkImport() {
    const item = this.querySelector('vaadin-item');
    if (item && !(item instanceof PolymerElement)) {
      console.warn(`Make sure you have imported the vaadin-item element.`);
    }
  }
}

customElements.define(ListBox.is, ListBox);

export { ListBox };
