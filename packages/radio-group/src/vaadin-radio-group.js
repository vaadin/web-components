/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { FieldAriaMixin } from '@vaadin/field-base/src/field-aria-mixin.js';
import { LabelMixin } from '@vaadin/field-base/src/label-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RadioButton } from './vaadin-radio-button.js';

/**
 * `<vaadin-radio-group>` is a web component that allows the user to choose one item from a group of choices.
 *
 * ```html
 * <vaadin-radio-group label="Travel class">
 *   <vaadin-radio-button value="economy">Economy</vaadin-radio-button>
 *   <vaadin-radio-button value="business">Business</vaadin-radio-button>
 *   <vaadin-radio-button value="firstClass">First Class</vaadin-radio-button>
 * </vaadin-radio-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name       | Description
 * ----------------|----------------
 * `container`     | The container element.
 * `label`         | The slotted label element wrapper.
 * `group-field`   | The radio button elements wrapper.
 * `helper-text`   | The slotted helper text element wrapper.
 * `error-message` | The slotted error message element wrapper.
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
 * `readonly`          | Set when the element is readonly          | :host
 * `invalid`           | Set when the element is invalid           | :host
 * `focused`           | Set when the element is focused           | :host
 * `has-label`         | Set when the element has a label          | :host
 * `has-value`         | Set when the element has a value          | :host
 * `has-helper`        | Set when the element has helper text      | :host
 * `has-error-message` | Set when the element has an error message | :host
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DirMixin
 */
class RadioGroup extends FieldAriaMixin(
  LabelMixin(FocusMixin(DisabledMixin(DirMixin(ThemableMixin(PolymerElement)))))
) {
  static get is() {
    return 'vaadin-radio-group';
  }

  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
        }

        :host::before {
          content: '\\2003';
          width: 0;
          display: inline-block;
        }

        :host([hidden]) {
          display: none !important;
        }

        [part='container'] {
          display: flex;
          flex-direction: column;
        }

        :host(:not([has-label])) [part='label'] {
          display: none;
        }
      </style>
      <div part="container">
        <div part="label">
          <slot name="label"></slot>
          <span part="indicator" aria-hidden="true"></span>
        </div>

        <div part="group-field">
          <slot></slot>
        </div>

        <div part="helper-text">
          <slot name="helper"></slot>
        </div>

        <div part="error-message">
          <slot name="error-message"></slot>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      /**
       * The value of the radio group.
       *
       * @type {string}
       */
      value: {
        type: String,
        notify: true,
        observer: '__valueChanged'
      },

      /**
       * When present, the user cannot modify the value of the radio group.
       * The property works similarly to the `disabled` one.
       * While the `disabled` property disables all the radio buttons inside the group,
       * the `readonly` property disables only unchecked ones.
       *
       * @type {!boolean}
       */
      readonly: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '__readonlyChanged'
      }
    };
  }

  constructor() {
    super();

    this.__registerRadioButton = this.__registerRadioButton.bind(this);
    this.__unregisterRadioButton = this.__unregisterRadioButton.bind(this);
    this.__onRadioButtonCheckedChange = this.__onRadioButtonCheckedChange.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    // See https://github.com/vaadin/vaadin-web-components/issues/94
    this.setAttribute('role', 'radiogroup');

    // Ensure every instance has unique id
    const uniqueId = (RadioGroup._uniqueRadioGroupId = 1 + RadioGroup._uniqueRadioGroupId || 0);
    this._fieldName = `${this.localName}-${uniqueId}`;

    this._observer = new FlattenedNodesObserver(this, ({ addedNodes, removedNodes }) => {
      // reverse() is used to set the last checked radio button value to radio group value
      this.__filterRadioButtons(addedNodes).reverse().forEach(this.registerRadioButton);
      this.__filterRadioButtons(removedNodes).forEach(this.unregisterRadioButton);
    });
  }

  __registerRadioButton(radioButton) {
    radioButton.name = this._fieldName;
    radioButton.addEventListener('checked-changed', this.__onRadioButtonCheckedChange);

    if (this.disabled) {
      radioButton.disabled = true;
    }

    if (radioButton.checked) {
      this.__selectRadioButton(radioButton);
    }
  }

  __unregisterRadioButton(radioButton) {
    radioButton.removeEventListener('checked-changed', this.__onRadioButtonCheckedChange);

    if (radioButton.checked) {
      this.value = null;
    }
  }

  /** @private */
  __filterRadioButtons(nodes) {
    return Array.from(nodes).filter((child) => child instanceof RadioButton);
  }

  /** @private */
  get __radioButtons() {
    return this.__filterRadioButtons(this.children);
  }

  /** @private */
  get __selectedRadioButton() {
    return this.__radioButtons.find((radioButton) => radioButton.checked);
  }

  /**
   * @param {CustomEvent} event
   * @private
   */
  __onRadioButtonCheckedChange(event) {
    if (event.target.checked) {
      this.__selectRadioButton(event.target);
    }
  }

  /**
   * @private
   * @param {string} newValue
   * @param {string} oldValue
   */
  __valueChanged(newValue, oldValue) {
    if (oldValue && !newValue) {
      this.__selectRadioButton(null);
      this.removeAttribute('has-value');
      return;
    }

    if (this.__selectedRadioButton && this.__selectedRadioButton.value === newValue) {
      return;
    }

    const newSelectedRadioButton = this.__radioButtons.find((radioButton) => {
      return radioButton.value === newValue;
    });

    if (newSelectedRadioButton) {
      this.__selectRadioButton(newSelectedRadioButton);
      this.toggleAttribute('has-value', true);
    } else {
      console.warn(`No <vaadin-radio-button> with value ${newValue} found.`);
    }
  }

  /**
   * @private
   * @param {boolean} newValue
   * @param {boolean} oldValue
   */
  __readonlyChanged(newValue, oldValue) {
    if (newValue !== oldValue) {
      this.__updateRadioButtonsDisabledProperty();
    }
  }

  /**
   * @param {boolean} disabled
   * @protected
   */
  _disabledChanged(disabled) {
    super._disabledChanged(disabled);

    this.__updateRadioButtonsDisabledProperty();
  }

  /**
   * Extends the method from `FocusMixin` in order to
   * prevent the `focused` attribute from removing in case
   * focus is moved between the radio buttons inside the group.
   *
   * @param {FocusEvent} event
   * @return {boolean}
   * @protected
   */
  _shouldRemoveFocus(event) {
    return !this.contains(event.relatedTarget);
  }

  /**
   * Extends the method from `FocusMixin` in order to
   * run validation once the group loses focus.
   *
   * @param {boolean} focused
   * @protected
   */
  _setFocused(focused) {
    super._setFocused(focused);

    if (!focused) {
      this.validate();
    }
  }

  /**
   * @param {RadioButton} radioButton
   * @private
   */
  __selectRadioButton(radioButton) {
    if (radioButton) {
      this.value = radioButton.value;
    } else {
      this.value = '';
    }

    this.__radioButtons.forEach((button) => {
      button.checked = button === radioButton;
    });

    this.validate();

    if (this.readonly) {
      this.__updateRadioButtonsDisabledProperty();
    }
  }

  /** @private */
  __updateRadioButtonsDisabledProperty() {
    this.__radioButtons.forEach((button) => {
      if (this.readonly) {
        // it's not possible to set readonly to radio buttons, but we can
        // unchecked ones instead.
        button.disabled = button !== this.__selectedRadioButton;
      } else {
        button.disabled = this.disabled;
      }
    });
  }
}

customElements.define(RadioGroup.is, RadioGroup);

export { RadioGroup };
