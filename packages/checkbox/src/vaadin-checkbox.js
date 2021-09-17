/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { AriaLabelMixin } from '@vaadin/field-base/src/aria-label-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { SlotLabelMixin } from '@vaadin/field-base/src/slot-label-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox>I accept the terms and conditions</vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|----------------
 * `container` | The container element
 * `checkbox`  | The wrapper element which contains slotted <input type="checkbox">
 * `label`     | The wrapper element which contains slotted <label>
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description | Part name
 * ----------------|-------------|--------------
 * `active`        | Set when the checkbox is pressed down, either with mouse, touch or the keyboard. | `:host`
 * `disabled`      | Set when the checkbox is disabled. | `:host`
 * `focus-ring`    | Set when the checkbox is focused using the keyboard. | `:host`
 * `focused`       | Set when the checkbox is focused. | `:host`
 * `indeterminate` | Set when the checkbox is in the indeterminate state. | `:host`
 * `checked`       | Set when the checkbox is checked. | `:host`
 * `has-label`     | Set when the checkbox has a label. | `:host`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 * @fires {CustomEvent} indeterminate-changed - Fired when the `indeterminate` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ActiveMixin
 * @mixes AriaLabelMixin
 * @mixes InputSlotMixin
 * @mixes CheckedMixin
 * @mixes SlotLabelMixin
 */
class Checkbox extends SlotLabelMixin(
  CheckedMixin(InputSlotMixin(AriaLabelMixin(ActiveMixin(ElementMixin(ThemableMixin(PolymerElement))))))
) {
  static get is() {
    return 'vaadin-checkbox';
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

        :host([disabled]) {
          -webkit-tap-highlight-color: transparent;
        }

        [part='container'] {
          display: inline-flex;
          align-items: baseline;
        }

        /* visually hidden */
        [part='checkbox'] ::slotted(input) {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: inherit;
          margin: 0;
        }
      </style>
      <div part="container">
        <div part="checkbox">
          <slot name="input"></slot>
        </div>
        <div part="label">
          <slot name="label"></slot>
        </div>
        <div style="display: none !important">
          <slot id="noop"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * True if the checkbox is in the indeterminate state which means
       * it is not possible to say whether it is checked or unchecked.
       * The state is reset once the user explicitly switches the checkbox.
       *
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
       *
       * @type {boolean}
       */
      indeterminate: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The name of the checkbox
       *
       * @type {string}
       */
      name: {
        type: String
      },

      /**
       * The value of the checkbox, "on" by default.
       *
       * @type {string}
       */
      value: {
        type: String,
        value: 'on',
        observer: '_valueChanged'
      }
    };
  }

  static get delegateProps() {
    return [...super.delegateProps, 'indeterminate', 'name'];
  }

  constructor() {
    super();

    this._setType('checkbox');
  }

  /**
   * @override
   * @protected
   * @type {HTMLSlotElement}
   */
  get _sourceSlot() {
    return this.$.noop;
  }

  /**
   * Extends the method of `ActiveMixin` in order to
   * prevent setting the `active` attribute when clicking on a link inside the label.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   */
  _shouldSetActive(event) {
    if (event.target.localName === 'a') {
      return false;
    }

    return super._shouldSetActive(event);
  }

  /**
   * Extends the method of `CheckedMixin` in order to
   * reset the indeterminate state once the user switches the checkbox.
   *
   * @param {boolean} checked
   * @protected
   * @override
   */
  _toggleChecked(checked) {
    if (this.indeterminate) {
      this.indeterminate = false;
    }

    super._toggleChecked(checked);
  }
}

customElements.define(Checkbox.is, Checkbox);

export { Checkbox };
