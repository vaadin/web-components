/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { KeyboardMixin } from '@vaadin/component-base/src/keyboard-mixin.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';
import { RadioButton } from './vaadin-radio-button.js';

/**
 * `<vaadin-radio-group>` is a web component that allows the user to choose one item from a group of choices.
 *
 * ```html
 * <vaadin-radio-group label="Travel class">
 *   <vaadin-radio-button value="economy" label="Economy"></vaadin-radio-button>
 *   <vaadin-radio-button value="business" label="Business"></vaadin-radio-button>
 *   <vaadin-radio-button value="firstClass" label="First Class"></vaadin-radio-button>
 * </vaadin-radio-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `group-field`        | The radio button elements wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
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
 * See [Styling Components](https://vaadin.com/docs/latest/styling/custom-theme/styling-components) documentation.
 *
 * @fires {CustomEvent} invalid-changed - Fired when the `invalid` property changes.
 * @fires {CustomEvent} value-changed - Fired when the `value` property changes.
 * @fires {CustomEvent} validated - Fired whenever the field is validated.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 * @mixes DisabledMixin
 * @mixes ElementMixin
 * @mixes FocusMixin
 * @mixes FieldMixin
 * @mixes KeyboardMixin
 */
class RadioGroup extends FieldMixin(
  FocusMixin(DisabledMixin(KeyboardMixin(ElementMixin(ThemableMixin(PolymerElement))))),
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

        .vaadin-group-field-container {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        :host(:not([has-label])) [part='label'] {
          display: none;
        }
      </style>
      <div class="vaadin-group-field-container">
        <div part="label">
          <slot name="label"></slot>
          <span part="required-indicator" aria-hidden="true"></span>
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

      <slot name="tooltip"></slot>
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
        value: '',
        observer: '__valueChanged',
      },

      /**
       * When present, the user cannot modify the value of the radio group.
       * The property works similarly to the `disabled` property.
       * While the `disabled` property disables all radio buttons inside the group,
       * the `readonly` property disables only unchecked ones.
       *
       * @type {boolean}
       */
      readonly: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '__readonlyChanged',
      },

      /**
       * @type {string}
       * @private
       */
      _fieldName: {
        type: String,
      },
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

    this.ariaTarget = this;

    // See https://github.com/vaadin/vaadin-web-components/issues/94
    this.setAttribute('role', 'radiogroup');

    this._fieldName = `${this.localName}-${generateUniqueId()}`;

    this._observer = new FlattenedNodesObserver(this, ({ addedNodes, removedNodes }) => {
      // Registers the added radio buttons in the reverse order
      // in order for the group to take the value of the most recent button.
      this.__filterRadioButtons(addedNodes).reverse().forEach(this.__registerRadioButton);

      // Unregisters the removed radio buttons.
      this.__filterRadioButtons(removedNodes).forEach(this.__unregisterRadioButton);
    });

    this._tooltipController = new TooltipController(this);
    this.addController(this._tooltipController);
  }

  /**
   * @param {!Array<!Node>} nodes
   * @return {!Array<!RadioButton>}
   * @private
   */
  __filterRadioButtons(nodes) {
    return nodes.filter((child) => child instanceof RadioButton);
  }

  /**
   * A collection of the group's radio buttons.
   *
   * @return {!Array<!RadioButton>}
   * @private
   */
  get __radioButtons() {
    return this.__filterRadioButtons([...this.children]);
  }

  /**
   * A currently selected radio button.
   *
   * @return {!RadioButton | undefined}
   * @private
   */
  get __selectedRadioButton() {
    return this.__radioButtons.find((radioButton) => radioButton.checked);
  }

  /**
   * @return {boolean}
   * @private
   */
  get isHorizontalRTL() {
    return this.getAttribute('dir') === 'rtl' && this._theme !== 'vertical';
  }

  /**
   * Override method inherited from `KeyboardMixin`
   * to implement the custom keyboard navigation as a replacement for the native one
   * in order for the navigation to work the same way across different browsers.
   *
   * @param {!KeyboardEvent} event
   * @override
   * @protected
   */
  _onKeyDown(event) {
    super._onKeyDown(event);

    const radioButton = event.composedPath().find((node) => node instanceof RadioButton);

    if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
      event.preventDefault();
      this.__selectNextRadioButton(radioButton);
    }

    if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      this.__selectPrevRadioButton(radioButton);
    }
  }

  /**
   * Override an observer from `FieldMixin`.
   *
   * @param {boolean} invalid
   * @protected
   * @override
   */
  _invalidChanged(invalid) {
    super._invalidChanged(invalid);

    if (invalid) {
      this.setAttribute('aria-invalid', 'true');
    } else {
      this.removeAttribute('aria-invalid');
    }
  }

  /**
   * @param {number} index
   * @private
   */
  __selectNextRadioButton(radioButton) {
    const index = this.__radioButtons.indexOf(radioButton);

    this.__selectIncRadioButton(index, this.isHorizontalRTL ? 1 : -1);
  }

  /**
   * @param {number} index
   * @private
   */
  __selectPrevRadioButton(radioButton) {
    const index = this.__radioButtons.indexOf(radioButton);

    this.__selectIncRadioButton(index, this.isHorizontalRTL ? -1 : 1);
  }

  /**
   * @param {number} index
   * @param {number} step
   * @private
   */
  __selectIncRadioButton(index, step) {
    const newIndex = (this.__radioButtons.length + index + step) % this.__radioButtons.length;
    const newRadioButton = this.__radioButtons[newIndex];

    if (newRadioButton.disabled) {
      this.__selectIncRadioButton(newIndex, step);
    } else {
      newRadioButton.focusElement.focus();
      newRadioButton.focusElement.click();
    }
  }

  /**
   * Registers the radio button after adding it to the group.
   *
   * @param {!RadioButton} radioButton
   * @private
   */
  __registerRadioButton(radioButton) {
    radioButton.name = this._fieldName;
    radioButton.addEventListener('checked-changed', this.__onRadioButtonCheckedChange);

    if (this.disabled || this.readonly) {
      radioButton.disabled = true;
    }

    if (radioButton.checked) {
      this.__selectRadioButton(radioButton);
    }
  }

  /**
   * Unregisters the radio button before removing it from the group.
   *
   * @param {!RadioButton} radioButton
   * @private
   */
  __unregisterRadioButton(radioButton) {
    radioButton.removeEventListener('checked-changed', this.__onRadioButtonCheckedChange);

    if (radioButton.value === this.value) {
      this.__selectRadioButton(null);
    }
  }

  /**
   * @param {!CustomEvent} event
   * @private
   */
  __onRadioButtonCheckedChange(event) {
    if (event.target.checked) {
      this.__selectRadioButton(event.target);
    }
  }

  /**
   * Whenever the user sets a non-empty value,
   * the method tries to select the radio button with that value
   * showing a warning if no radio button was found with the given value.
   * If the new value is empty, the method deselects the currently selected radio button.
   * At last, the method toggles the `has-value` attribute considering the new value.
   *
   * @param {string | null | undefined} newValue
   * @param {string | null | undefined} oldValue
   * @private
   */
  __valueChanged(newValue, oldValue) {
    if (oldValue === undefined && newValue === '') {
      return;
    }

    if (newValue) {
      const newSelectedRadioButton = this.__radioButtons.find((radioButton) => {
        return radioButton.value === newValue;
      });

      if (newSelectedRadioButton) {
        this.__selectRadioButton(newSelectedRadioButton);
        this.toggleAttribute('has-value', true);
      } else {
        console.warn(`The radio button with the value "${newValue}" was not found.`);
      }
    } else {
      this.__selectRadioButton(null);
      this.removeAttribute('has-value');
    }

    if (oldValue !== undefined) {
      this.validate();
    }
  }

  /**
   * Whenever `readonly` property changes on the group element,
   * the method updates the `disabled` property for the radio buttons.
   *
   * @param {boolean} newValue
   * @param {boolean} oldValue
   * @private
   */
  __readonlyChanged(newValue, oldValue) {
    // Prevent updating the `disabled` property for the radio buttons at initialization.
    // Otherwise, the group's radio buttons may end up enabled regardless
    // an intentionally added `disabled` attribute on some of them.
    if (!newValue && oldValue === undefined) {
      return;
    }

    if (oldValue !== newValue) {
      this.__updateRadioButtonsDisabledProperty();
    }
  }

  /**
   * Override method inherited from `DisabledMixin`
   * to update the `disabled` property for the radio buttons
   * whenever the property changes on the group element.
   *
   * @param {boolean} newValue
   * @param {boolean} oldValue
   * @override
   * @protected
   */
  _disabledChanged(newValue, oldValue) {
    super._disabledChanged(newValue, oldValue);

    // Prevent updating the `disabled` property for the radio buttons at initialization.
    // Otherwise, the group's radio buttons may end up enabled regardless
    // an intentionally added `disabled` attribute on some of them.
    if (!newValue && oldValue === undefined) {
      return;
    }

    if (oldValue !== newValue) {
      this.__updateRadioButtonsDisabledProperty();
    }
  }

  /**
   * Override method inherited from `FocusMixin`
   * to prevent removing the `focused` attribute
   * when focus moves between radio buttons inside the group.
   *
   * @param {!FocusEvent} event
   * @return {boolean}
   * @protected
   */
  _shouldRemoveFocus(event) {
    return !this.contains(event.relatedTarget);
  }

  /**
   * Override method inherited from `FocusMixin`
   * to run validation when the group loses focus.
   *
   * @param {boolean} focused
   * @override
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

    if (this.readonly) {
      this.__updateRadioButtonsDisabledProperty();
    }
  }

  /**
   * If the group is read-only, the method disables the unchecked radio buttons.
   * Otherwise, the method propagates the group's `disabled` property to the radio buttons.
   *
   * @private
   */
  __updateRadioButtonsDisabledProperty() {
    this.__radioButtons.forEach((button) => {
      if (this.readonly) {
        // The native radio button doesn't support the `readonly` attribute
        // so the state can be only imitated, by disabling unchecked radio buttons.
        button.disabled = button !== this.__selectedRadioButton;
      } else {
        button.disabled = this.disabled;
      }
    });
  }
}

customElements.define(RadioGroup.is, RadioGroup);

export { RadioGroup };
