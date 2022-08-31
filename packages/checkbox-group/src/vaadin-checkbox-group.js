/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { FlattenedNodesObserver } from '@polymer/polymer/lib/utils/flattened-nodes-observer.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { Checkbox } from '@vaadin/checkbox/src/vaadin-checkbox.js';
import { DisabledMixin } from '@vaadin/component-base/src/disabled-mixin.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { FocusMixin } from '@vaadin/component-base/src/focus-mixin.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-checkbox-group>` is a web component that allows the user to choose several items from a group of binary choices.
 *
 * ```html
 * <vaadin-checkbox-group label="Preferred language of contact:">
 *   <vaadin-checkbox value="en" label="English"></vaadin-checkbox>
 *   <vaadin-checkbox value="fr" label="Français"></vaadin-checkbox>
 *   <vaadin-checkbox value="de" label="Deutsch"></vaadin-checkbox>
 * </vaadin-checkbox-group>
 * ```
 *
 * ### Styling
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name            | Description
 * ---------------------|----------------
 * `label`              | The slotted label element wrapper
 * `group-field`        | The checkbox elements wrapper
 * `helper-text`        | The slotted helper text element wrapper
 * `error-message`      | The slotted error message element wrapper
 * `required-indicator` | The `required` state indicator element
 *
 * The following state attributes are available for styling:
 *
 * Attribute           | Description                               | Part name
 * --------------------|-------------------------------------------|------------
 * `disabled`          | Set when the element is disabled          | :host
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
 */
class CheckboxGroup extends FieldMixin(FocusMixin(DisabledMixin(ElementMixin(ThemableMixin(PolymerElement))))) {
  static get is() {
    return 'vaadin-checkbox-group';
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
    `;
  }

  static get properties() {
    return {
      /**
       * An array containing values of the currently checked checkboxes.
       *
       * The array is immutable so toggling checkboxes always results in
       * creating a new array.
       *
       * @type {!Array<!string>}
       */
      value: {
        type: Array,
        value: () => [],
        notify: true,
        observer: '__valueChanged',
      },
    };
  }

  constructor() {
    super();

    this.__registerCheckbox = this.__registerCheckbox.bind(this);
    this.__unregisterCheckbox = this.__unregisterCheckbox.bind(this);
    this.__onCheckboxCheckedChanged = this.__onCheckboxCheckedChanged.bind(this);
  }

  /** @protected */
  ready() {
    super.ready();

    this.ariaTarget = this;

    // See https://github.com/vaadin/vaadin-web-components/issues/94
    this.setAttribute('role', 'group');

    this._observer = new FlattenedNodesObserver(this, ({ addedNodes, removedNodes }) => {
      const addedCheckboxes = this.__filterCheckboxes(addedNodes);
      const removedCheckboxes = this.__filterCheckboxes(removedNodes);

      addedCheckboxes.forEach(this.__registerCheckbox);
      removedCheckboxes.forEach(this.__unregisterCheckbox);

      this.__warnOfCheckboxesWithoutValue(addedCheckboxes);
    });
  }

  /**
   * Override method inherited from `ValidateMixin`
   * to validate the value array.
   *
   * @override
   * @return {boolean}
   */
  checkValidity() {
    return !this.required || this.value.length > 0;
  }

  /**
   * @param {!Array<!Node>} nodes
   * @return {!Array<!Checkbox>}
   * @private
   */
  __filterCheckboxes(nodes) {
    return nodes.filter((child) => child instanceof Checkbox);
  }

  /**
   * A collection of the checkboxes.
   *
   * @return {!Array<!Checkbox>}
   * @private
   */
  get __checkboxes() {
    return this.__filterCheckboxes([...this.children]);
  }

  /**
   * @param {!Array<!Checkbox>} checkboxes
   * @private
   */
  __warnOfCheckboxesWithoutValue(checkboxes) {
    const hasCheckboxesWithoutValue = checkboxes.some((checkbox) => {
      const { value } = checkbox;

      return !checkbox.hasAttribute('value') && (!value || value === 'on');
    });

    if (hasCheckboxesWithoutValue) {
      console.warn('Please provide the value attribute to all the checkboxes inside the checkbox group.');
    }
  }

  /**
   * Registers the checkbox after adding it to the group.
   *
   * @param {!Checkbox} checkbox
   * @private
   */
  __registerCheckbox(checkbox) {
    checkbox.addEventListener('checked-changed', this.__onCheckboxCheckedChanged);

    if (this.disabled) {
      checkbox.disabled = true;
    }

    if (checkbox.checked) {
      this.__addCheckboxToValue(checkbox.value);
    } else if (this.value.includes(checkbox.value)) {
      checkbox.checked = true;
    }
  }

  /**
   * Unregisters the checkbox before removing it from the group.
   *
   * @param {!Checkbox} checkbox
   * @private
   */
  __unregisterCheckbox(checkbox) {
    checkbox.removeEventListener('checked-changed', this.__onCheckboxCheckedChanged);

    if (checkbox.checked) {
      this.__removeCheckboxFromValue(checkbox.value);
    }
  }

  /**
   * Override method inherited from `DisabledMixin`
   * to propagate the `disabled` property to the checkboxes.
   *
   * @param {boolean} newValue
   * @param {boolean} oldValue
   * @override
   * @protected
   */
  _disabledChanged(newValue, oldValue) {
    super._disabledChanged(newValue, oldValue);

    // Prevent updating the `disabled` property for the checkboxes at initialization.
    // Otherwise, the checkboxes may end up enabled regardless the `disabled` attribute
    // intentionally added by the user on some of them.
    if (!newValue && oldValue === undefined) {
      return;
    }

    if (oldValue !== newValue) {
      this.__checkboxes.forEach((checkbox) => {
        checkbox.disabled = newValue;
      });
    }
  }

  /**
   * @param {string} value
   * @private
   */
  __addCheckboxToValue(value) {
    if (!this.value.includes(value)) {
      this.value = [...this.value, value];
    }
  }

  /**
   * @param {string} value
   * @private
   */
  __removeCheckboxFromValue(value) {
    if (this.value.includes(value)) {
      this.value = this.value.filter((v) => v !== value);
    }
  }

  /**
   * @param {!CustomEvent} event
   * @private
   */
  __onCheckboxCheckedChanged(event) {
    const checkbox = event.target;

    if (checkbox.checked) {
      this.__addCheckboxToValue(checkbox.value);
    } else {
      this.__removeCheckboxFromValue(checkbox.value);
    }
  }

  /**
   * @param {string | null | undefined} value
   * @param {string | null | undefined} oldValue
   * @private
   */
  __valueChanged(value, oldValue) {
    // Setting initial value to empty array, skip validation
    if (value.length === 0 && oldValue === undefined) {
      return;
    }

    this.toggleAttribute('has-value', value.length > 0);

    this.__checkboxes.forEach((checkbox) => {
      checkbox.checked = value.includes(checkbox.value);
    });

    if (oldValue !== undefined) {
      this.validate();
    }
  }

  /**
   * Override method inherited from `FocusMixin`
   * to prevent removing the `focused` attribute
   * when focus moves between checkboxes inside the group.
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
}

customElements.define(CheckboxGroup.is, CheckboxGroup);

export { CheckboxGroup };
