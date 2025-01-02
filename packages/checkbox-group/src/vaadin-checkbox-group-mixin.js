/**
 * @license
 * Copyright (c) 2018 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { DisabledMixin } from '@vaadin/a11y-base/src/disabled-mixin.js';
import { FocusMixin } from '@vaadin/a11y-base/src/focus-mixin.js';
import { SlotObserver } from '@vaadin/component-base/src/slot-observer.js';
import { TooltipController } from '@vaadin/component-base/src/tooltip-controller.js';
import { FieldMixin } from '@vaadin/field-base/src/field-mixin.js';

/**
 * A mixin providing common checkbox-group functionality.
 *
 * @polymerMixin
 * @mixes DisabledMixin
 * @mixes FieldMixin
 * @mixes FocusMixin
 * @mixes KeyboardMixin
 */
export const CheckboxGroupMixin = (superclass) =>
  class CheckboxGroupMixinClass extends FieldMixin(FocusMixin(DisabledMixin(superclass))) {
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
          sync: true,
          observer: '__valueChanged',
        },

        /**
         * When true, the user cannot modify the value of the checkbox group.
         * The difference between `disabled` and `readonly` is that in the
         * read-only checkbox group, all the checkboxes are also read-only,
         * and therefore remain focusable and announced by screen readers.
         */
        readonly: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer: '__readonlyChanged',
        },
      };
    }

    constructor() {
      super();

      this.__registerCheckbox = this.__registerCheckbox.bind(this);
      this.__unregisterCheckbox = this.__unregisterCheckbox.bind(this);
      this.__onCheckboxCheckedChanged = this.__onCheckboxCheckedChanged.bind(this);

      this._tooltipController = new TooltipController(this);
      this._tooltipController.addEventListener('tooltip-changed', (event) => {
        const tooltip = event.detail.node;
        if (tooltip && tooltip.isConnected) {
          // Tooltip element has been added to the DOM
          const inputs = this.__checkboxes.map((checkbox) => checkbox.inputElement);
          this._tooltipController.setAriaTarget(inputs);
        } else {
          // Tooltip element is no longer connected
          this._tooltipController.setAriaTarget([]);
        }
      });
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

    /** @protected */
    ready() {
      super.ready();

      this.ariaTarget = this;

      // See https://github.com/vaadin/vaadin-web-components/issues/94
      this.setAttribute('role', 'group');

      const slot = this.shadowRoot.querySelector('slot:not([name])');
      this._observer = new SlotObserver(slot, ({ addedNodes, removedNodes }) => {
        const addedCheckboxes = this.__filterCheckboxes(addedNodes);
        const removedCheckboxes = this.__filterCheckboxes(removedNodes);

        addedCheckboxes.forEach(this.__registerCheckbox);
        removedCheckboxes.forEach(this.__unregisterCheckbox);

        const inputs = this.__checkboxes.map((checkbox) => checkbox.inputElement);
        this._tooltipController.setAriaTarget(inputs);

        this.__warnOfCheckboxesWithoutValue(addedCheckboxes);
      });

      this.addController(this._tooltipController);
    }

    /**
     * Override method inherited from `ValidateMixin`
     * to validate the value array.
     *
     * @override
     * @return {boolean}
     */
    checkValidity() {
      return !this.required || Boolean(this.value && this.value.length > 0);
    }

    /**
     * @param {!Array<!Node>} nodes
     * @return {!Array<!Checkbox>}
     * @private
     */
    __filterCheckboxes(nodes) {
      return nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE && node.localName === 'vaadin-checkbox');
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

      if (this.readonly) {
        checkbox.readonly = true;
      }

      if (checkbox.checked) {
        this.__addCheckboxToValue(checkbox.value);
      } else if (this.value && this.value.includes(checkbox.value)) {
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
      if (!this.value) {
        this.value = [value];
      } else if (!this.value.includes(value)) {
        this.value = [...this.value, value];
      }
    }

    /**
     * @param {string} value
     * @private
     */
    __removeCheckboxFromValue(value) {
      if (this.value && this.value.includes(value)) {
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
     * @param {string[] | null | undefined} value
     * @param {string[] | null | undefined} oldValue
     * @private
     */
    __valueChanged(value, oldValue) {
      // Setting initial value to empty array, skip validation
      if (value && value.length === 0 && oldValue === undefined) {
        return;
      }

      this.toggleAttribute('has-value', value && value.length > 0);

      this.__checkboxes.forEach((checkbox) => {
        checkbox.checked = value && value.includes(checkbox.value);
      });

      if (oldValue !== undefined) {
        this._requestValidation();
      }
    }

    /** @private */
    __readonlyChanged(readonly, oldReadonly) {
      if (readonly || oldReadonly) {
        this.__checkboxes.forEach((checkbox) => {
          checkbox.readonly = readonly;
        });
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

      // Do not validate when focusout is caused by document
      // losing focus, which happens on browser tab switch.
      if (!focused && document.hasFocus()) {
        this._requestValidation();
      }
    }
  };
