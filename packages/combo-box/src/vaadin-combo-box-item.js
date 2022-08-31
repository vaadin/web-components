/**
 * @license
 * Copyright (c) 2015 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * An item element used by the `<vaadin-combo-box>` dropdown.
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|--------------
 * `checkmark` | The graphical checkmark shown for a selected item
 * `content`   | The element that wraps the item content
 *
 * The following state attributes are exposed for styling:
 *
 * Attribute    | Description
 * -------------|-------------
 * `selected`   | Set when the item is selected
 * `focused`    | Set when the item is focused
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @mixes ThemableMixin
 * @mixes DirMixin
 * @private
 */
export class ComboBoxItem extends ThemableMixin(DirMixin(PolymerElement)) {
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
      <span part="checkmark" aria-hidden="true"></span>
      <div part="content">
        <slot></slot>
      </div>
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
        reflectToAttribute: true,
      },

      /**
       * True when item is focused
       */
      focused: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * Custom function for rendering the content of the `<vaadin-combo-box-item>` propagated from the combo box element.
       */
      renderer: Function,

      /**
       * Saved instance of a custom renderer function.
       */
      _oldRenderer: Function,
    };
  }

  static get observers() {
    return ['__rendererOrItemChanged(renderer, index, item.*, selected, focused)', '__updateLabel(label, renderer)'];
  }

  connectedCallback() {
    super.connectedCallback();

    this._comboBox = this.parentNode.comboBox;

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
      selected: this.selected,
    };

    this.renderer(this, this._comboBox, model);
  }

  /** @private */
  __rendererOrItemChanged(renderer, index, item) {
    if (item === undefined || index === undefined) {
      return;
    }

    if (this._oldRenderer !== renderer) {
      this.innerHTML = '';
      // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
      // When clearing the rendered content, this part needs to be manually disposed of.
      // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
      delete this._$litPart$;
    }

    if (renderer) {
      this._oldRenderer = renderer;
      this.requestContentUpdate();
    }
  }

  /** @private */
  __updateLabel(label, renderer) {
    if (renderer) {
      return;
    }

    this.textContent = label;
  }
}

customElements.define(ComboBoxItem.is, ComboBoxItem);
