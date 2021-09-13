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
 * `<vaadin-checkbox>` is a Web Component for customized checkboxes.
 *
 * ```html
 * <vaadin-checkbox>
 *   Make my profile visible
 * </vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name         | Description
 * ------------------|----------------
 * `checkbox`        | The wrapper element for the native <input type="checkbox">
 * `label`           | The wrapper element in which the component's children, namely the label, is slotted
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|--------------
 * `active`     | Set when the checkbox is pressed down, either with mouse, touch or the keyboard. | `:host`
 * `disabled`   | Set when the checkbox is disabled. | `:host`
 * `focus-ring` | Set when the checkbox is focused using the keyboard. | `:host`
 * `focused`    | Set when the checkbox is focused. | `:host`
 * `indeterminate` | Set when the checkbox is in indeterminate mode. | `:host`
 * `checked` | Set when the checkbox is checked. | `:host`
 * `empty` | Set when there is no label provided. | `label`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} change - Fired when the user commits a value change.
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
       * it is not possible to say whether the checkbox is checked or unchecked.
       * The state resets once the checkbox gets checked or unchecked.
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
   */
  get _sourceSlot() {
    return this.$.noop;
  }

  /**
   * @protected
   * @override
   */
  _toggleChecked() {
    this.indeterminate = false;

    super._toggleChecked();

    this.dispatchEvent(new CustomEvent('change', { composed: false, bubbles: true }));
  }

  /**
   * Fired when the user commits a value change.
   *
   * @event change
   */
}

customElements.define(Checkbox.is, Checkbox);

export { Checkbox };
