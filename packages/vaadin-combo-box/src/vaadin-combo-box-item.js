/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { DirMixin } from '@vaadin/vaadin-element-mixin/vaadin-dir-mixin.js';

/**
 * The default element used for items in the vaadin-combo-box.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ---|---
 * `content` | The element that wraps the item content
 *
 * The following state attributes are exposed for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `selected` | Set when the item is selected | :host
 * `focused` | Set when the item is focused | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @mixes ThemableMixin
 * @private
 */
class ComboBoxItemElement extends ThemableMixin(DirMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <div part="content" id="content"></div>
    `;
  }

  static get is() {
    return 'vaadin-combo-box-item';
  }

  static get properties() {
    return {
      /**
       * The index of the item
       */
      index: Number,

      /**
       * The item to render
       * @type {(String|Object)}
       */
      item: Object,

      /**
       * The text label corresponding to the item
       */
      label: String,

      /**
       * True when item is selected
       */
      selected: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * True when item is focused
       */
      focused: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Custom function for rendering the content of the `<vaadin-combo-box-item>` propagated from the combo box element.
       */
      renderer: Function,

      /**
       * Saved instance of a custom renderer function.
       */
      _oldRenderer: Function
    };
  }

  static get observers() {
    return ['__rendererOrItemChanged(renderer, index, item.*, selected, focused)', '__updateLabel(label, renderer)'];
  }

  connectedCallback() {
    super.connectedCallback();

    const overlay = this.getRootNode().host.getRootNode().host;
    const dropdown = overlay.__dataHost;
    const comboBoxOverlay = dropdown.getRootNode().host;
    this._comboBox = comboBoxOverlay.getRootNode().host;

    const hostDir = this._comboBox.getAttribute('dir');
    if (hostDir) {
      this.setAttribute('dir', hostDir);
    }
  }

  /**
   * Requests an update for the content of the item.
   * While performing the update, it invokes the renderer passed in the `renderer` property.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (!this.renderer) {
      return;
    }

    const model = {
      index: this.index,
      item: this.item,
      focused: this.focused,
      selected: this.selected
    };

    this.renderer(this.$.content, this._comboBox, model);
  }

  /** @private */
  __rendererOrItemChanged(renderer, index, item, _selected, _focused) {
    if (item === undefined || index === undefined) {
      return;
    }

    if (this._oldRenderer !== renderer) {
      this.$.content.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete this.$.content._$litPart$;
    }

    if (renderer) {
      this._oldRenderer = renderer;
      this.requestContentUpdate();
    }
  }

  /** @private */
  __updateLabel(label, renderer) {
    if (renderer) return;

    if (this.$.content) {
      this.$.content.textContent = label;
    }
  }
}

customElements.define(ComboBoxItemElement.is, ComboBoxItemElement);
