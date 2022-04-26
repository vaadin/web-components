/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { DelegateFocusMixin } from '@vaadin/field-base/src/delegate-focus-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { SlotTargetController } from '@vaadin/field-base/src/slot-target-controller.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-checkbox>` is an input field representing a binary choice.
 *
 * ```html
 * <vaadin-checkbox label="I accept the terms and conditions"></vaadin-checkbox>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name   | Description
 * ------------|----------------
 * `checkbox`  | The wrapper element that contains slotted <input type="checkbox">.
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
 * @mixes ControllerMixin
 * @mixes ThemableMixin
 * @mixes ElementMixin
 * @mixes ActiveMixin
 * @mixes DelegateFocusMixin
 * @mixes CheckedMixin
 * @mixes LabelMixin
 */
class Checkbox extends LabelMixin(
  CheckedMixin(DelegateFocusMixin(ActiveMixin(ElementMixin(ThemableMixin(ControllerMixin(PolymerElement)))))),
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

        .vaadin-checkbox-container {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: baseline;
        }

        .vaadin-checkbox-wrapper {
          position: relative;
          height: 100%;
        }

        /* visually hidden */
        ::slotted(input) {
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
      <div class="vaadin-checkbox-container">
        <div class="vaadin-checkbox-wrapper">
          <div part="checkbox"></div>
          <slot name="input"></slot>
        </div>

        <slot name="label"></slot>

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
       * The state is reset once the user switches the checkbox by hand.
       *
       * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Indeterminate_state_checkboxes
       *
       * @type {boolean}
       */
      indeterminate: {
        type: Boolean,
        notify: true,
        value: false,
        reflectToAttribute: true,
      },

      /**
       * The name of the checkbox.
       *
       * @type {string}
       */
      name: {
        type: String,
        value: '',
      },
    };
  }

  /** @override */
  static get delegateProps() {
    return [...super.delegateProps, 'indeterminate'];
  }

  /** @override */
  static get delegateAttrs() {
    return [...super.delegateAttrs, 'name'];
  }

  constructor() {
    super();

    this._setType('checkbox');

    // Set the string "on" as the default value for the checkbox following the HTML specification:
    // https://html.spec.whatwg.org/multipage/input.html#dom-input-value-default-on
    this.value = 'on';
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();

    if (!this._inputController) {
      this._inputController = new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      });
      this.addController(this._inputController);
      this.addController(new LabelledInputController(this.inputElement, this._labelController));
      this.addController(
        new SlotTargetController(
          this.$.noop,
          () => this._labelController.node,
          () => this.__warnDeprecated(),
        ),
      );
    }
  }

  /** @private */
  __warnDeprecated() {
    console.warn(
      `WARNING: Since Vaadin 22, placing the label as a direct child of a <vaadin-checkbox> is deprecated.
Please use <label slot="label"> wrapper or the label property instead.`,
    );
  }

  /**
   * Extends the method from `ActiveMixin` in order to
   * prevent setting the `active` attribute when interacting with a link inside the label.
   *
   * @param {Event} event
   * @return {boolean}
   * @protected
   * @override
   */
  _shouldSetActive(event) {
    if (event.target.localName === 'a') {
      return false;
    }

    return super._shouldSetActive(event);
  }

  /**
   * Extends the method from `CheckedMixin` in order to
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
