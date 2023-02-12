/**
 * @license
 * Copyright (c) 2017 - 2023 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ActiveMixin } from '@vaadin/component-base/src/active-mixin.js';
import { ControllerMixin } from '@vaadin/component-base/src/controller-mixin.js';
import { DelegateFocusMixin } from '@vaadin/component-base/src/delegate-focus-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { CheckedMixin } from '@vaadin/field-base/src/checked-mixin.js';
import { InputController } from '@vaadin/field-base/src/input-controller.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { LabelledInputController } from '@vaadin/field-base/src/labelled-input-controller.js';
import { registerStyles, ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { checkboxStyles } from './vaadin-checkbox-styles.js';

registerStyles('vaadin-checkbox', checkboxStyles, { moduleId: 'vaadin-checkbox-styles' });

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
 * ------------|-------------
 * `checkbox`  | The element representing a stylable custom checkbox.
 *
 * The following state attributes are available for styling:
 *
 * Attribute       | Description
 * ----------------|-------------
 * `active`        | Set when the checkbox is activated with mouse, touch or the keyboard.
 * `checked`       | Set when the checkbox is checked.
 * `disabled`      | Set when the checkbox is disabled.
 * `focus-ring`    | Set when the checkbox is focused using the keyboard.
 * `focused`       | Set when the checkbox is focused.
 * `indeterminate` | Set when the checkbox is in the indeterminate state.
 * `has-label`     | Set when the checkbox has a label.
 *
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
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
      <div class="vaadin-checkbox-container">
        <div part="checkbox" aria-hidden="true"></div>
        <slot name="input"></slot>
        <slot name="label"></slot>
      </div>
      <slot name="tooltip"></slot>
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
  ready() {
    super.ready();

    this.addController(
      new InputController(this, (input) => {
        this._setInputElement(input);
        this._setFocusElement(input);
        this.stateTarget = input;
        this.ariaTarget = input;
      }),
    );
    this.addController(new LabelledInputController(this.inputElement, this._labelController));
    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
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
