/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { AriaLabelController } from '@vaadin/field-base/src/aria-label-controller.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { InputSlotMixin } from '@vaadin/field-base/src/input-slot-mixin.js';
import { SlotLabelMixin } from '@vaadin/field-base/src/slot-label-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-radio-button>` is a web component representing a choice in a radio group.
 * Only one radio button in the group can be selected at the same time.
 *
 * ```html
 * <vaadin-radio-group label="Travel class">
 *  <vaadin-radio-button value="economy">Economy</vaadin-radio-button>
 *  <vaadin-radio-button value="business">Business</vaadin-radio-button>
 *  <vaadin-radio-button value="firstClass">First Class</vaadin-radio-button>
 * </vaadin-radio-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|----------------
 * `container` | The container element.
 * `radio`     | The wrapper element that contains slotted `<input type="radio">`.
 * `label`     | The wrapper element that contains slotted `<label>`.
 *
 * The following state attributes are available for styling:
 *
 * Attribute    | Description | Part name
 * -------------|-------------|------------
 * `active`     | Set when the radio button is pressed down, either with a pointer or the keyboard. | `:host`
 * `disabled`   | Set when the radio button is disabled. | `:host`
 * `focus-ring` | Set when the radio button is focused using the keyboard. | `:host`
 * `focused`    | Set when the radio button is focused. | `:host`
 * `checked`    | Set when the radio button is checked. | `:host`
 * `has-label`  | Set when the radio button has a label. | `:host`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} checked-changed - Fired when the `checked` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ActiveMixin
 * @mixes InputSlotMixin
 * @mixes CheckedMixin
 * @mixes SlotLabelMixin
 */
class RadioButton extends SlotLabelMixin(
  CheckedMixin(InputSlotMixin(ActiveMixin(ElementMixin(ThemableMixin(PolymerElement)))))
) {
  static get is() {
    return 'vaadin-radio-button';
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
        [part='radio'] ::slotted(input) {
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
        <div part="radio">
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
       * The name of the radio button.
       *
       * @type {string}
       */
      name: {
        type: String,
        value: ''
      }
    };
  }

  /** @override */
  static get delegateAttrs() {
    return [...super.delegateAttrs, 'name'];
  }

  constructor() {
    super();

    this._setType('radio');

    // Set the string "on" as the default value for the radio button following the HTML specification:
    // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
    this.value = 'on';
  }

  /**
   * A reference to the default slot from which nodes are forwarded to the label node.
   *
   * @override
   * @protected
   * @type {HTMLSlotElement}
   */
  get _sourceSlot() {
    return this.$.noop;
  }

  /** @protected */
  ready() {
    super.ready();

    this.addController(new AriaLabelController(this));
  }
}

customElements.define(RadioButton.is, RadioButton);

export { RadioButton };
