/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/component-base/src/dom-utils.js';
import { generateUniqueId } from '@vaadin/component-base/src/unique-id-utils.js';

let spacingDeprecationNotified = false;
let labelWidthDeprecationNotified = false;
let labelSpacingDeprecationNotified = false;

/**
 * @polymerMixin
 */
export const FormItemMixin = (superClass) =>
  class extends superClass {
    constructor() {
      super();
      this.__updateInvalidState = this.__updateInvalidState.bind(this);

      /**
       * An observer for a field node to reflect its `required` and `invalid` attributes to the component.
       *
       * @type {MutationObserver}
       * @private
       */
      this.__fieldNodeObserver = new MutationObserver(() => this.__updateRequiredState(this.__fieldNode.required));

      /**
       * The first label node in the label slot.
       *
       * @type {HTMLElement | null}
       * @private
       */
      this.__labelNode = null;

      /**
       * The first field node in the content slot.
       *
       * An element is considered a field when it has the `checkValidity` or `validate` method.
       *
       * @type {HTMLElement | null}
       * @private
       */
      this.__fieldNode = null;
    }

    /** @protected */
    ready() {
      super.ready();

      const computedStyle = getComputedStyle(this);
      const spacing = computedStyle.getPropertyValue('--vaadin-form-item-row-spacing');
      const labelWidth = computedStyle.getPropertyValue('--vaadin-form-item-label-width');
      const labelSpacing = computedStyle.getPropertyValue('--vaadin-form-item-label-spacing');

      if (!spacingDeprecationNotified && spacing !== '' && parseInt(spacing) !== 0) {
        console.warn(
          '`--vaadin-form-item-row-spacing` is deprecated since 24.7. Use `--vaadin-form-layout-row-spacing` on <vaadin-form-layout> instead.',
        );
        spacingDeprecationNotified = true;
      }

      if (!labelWidthDeprecationNotified && labelWidth !== '' && parseInt(labelWidth) !== 0) {
        console.warn(
          '`--vaadin-form-item-label-width` is deprecated since 24.7. Use `--vaadin-form-layout-label-width` on <vaadin-form-layout> instead.',
        );
        labelWidthDeprecationNotified = true;
      }

      if (!labelSpacingDeprecationNotified && labelSpacing !== '' && parseInt(labelSpacing) !== 0) {
        console.warn(
          '`--vaadin-form-item-label-spacing` is deprecated since 24.7. Use `--vaadin-form-layout-label-spacing` on <vaadin-form-layout> instead.',
        );
        labelSpacingDeprecationNotified = true;
      }
    }

    /**
     * Returns a target element to add ARIA attributes to for a field.
     *
     * - For Vaadin field components, the method returns an element
     * obtained through the `ariaTarget` property defined in `FieldMixin`.
     * - In other cases, the method returns the field element itself.
     *
     * @param {HTMLElement} field
     * @protected
     */
    _getFieldAriaTarget(field) {
      return field.ariaTarget || field;
    }

    /**
     * Links the label to a field by adding the label id to
     * the `aria-labelledby` attribute of the field's ARIA target element.
     *
     * @param {HTMLElement} field
     * @private
     */
    __linkLabelToField(field) {
      addValueToAttribute(this._getFieldAriaTarget(field), 'aria-labelledby', this.__labelId);
    }

    /**
     * Unlinks the label from a field by removing the label id from
     * the `aria-labelledby` attribute of the field's ARIA target element.
     *
     * @param {HTMLElement} field
     * @private
     */
    __unlinkLabelFromField(field) {
      removeValueFromAttribute(this._getFieldAriaTarget(field), 'aria-labelledby', this.__labelId);
    }

    /** @private */
    __onLabelClick() {
      const fieldNode = this.__fieldNode;
      if (fieldNode) {
        fieldNode.focus();
        fieldNode.click();
      }
    }

    /** @private */
    __getValidateFunction(field) {
      return field.validate || field.checkValidity;
    }

    /**
     * A `slotchange` event handler for the label slot.
     *
     * - Ensures the label id is only assigned to the first label node.
     * - Ensures the label node is linked to the first field node via the `aria-labelledby` attribute
     * if both nodes are provided, and unlinked otherwise.
     *
     * @private
     */
    __onLabelSlotChange() {
      if (this.__labelNode) {
        this.__labelNode = null;

        if (this.__fieldNode) {
          this.__unlinkLabelFromField(this.__fieldNode);
        }
      }

      const newLabelNode = this.$.labelSlot.assignedElements()[0];
      if (newLabelNode) {
        this.__labelNode = newLabelNode;

        if (this.__labelNode.id) {
          // The new label node already has an id. Let's use it.
          this.__labelId = this.__labelNode.id;
        } else {
          // The new label node doesn't have an id yet. Generate a unique one.
          this.__labelId = `label-${this.localName}-${generateUniqueId()}`;
          this.__labelNode.id = this.__labelId;
        }

        if (this.__fieldNode) {
          this.__linkLabelToField(this.__fieldNode);
        }
      }
    }

    /**
     * A `slotchange` event handler for the content slot.
     *
     * - Ensures the label node is only linked to the first field node via the `aria-labelledby` attribute.
     * - Sets up an observer for the `required` attribute changes on the first field
     * to reflect the attribute on the component. Ensures the observer is disconnected from the field
     * as soon as it is removed or replaced by another one.
     *
     * @private
     */
    __onContentSlotChange() {
      if (this.__fieldNode) {
        // Discard the old field
        this.__unlinkLabelFromField(this.__fieldNode);
        this.__updateRequiredState(false);
        this.__fieldNodeObserver.disconnect();
        this.__fieldNode = null;
      }

      const fieldNodes = this.$.contentSlot.assignedElements();
      if (fieldNodes.length > 1) {
        console.warn(
          `WARNING: Since Vaadin 23, placing multiple fields directly to a <vaadin-form-item> is deprecated.
Please wrap fields with a <vaadin-custom-field> instead.`,
        );
      }

      const newFieldNode = fieldNodes.find((field) => {
        return !!this.__getValidateFunction(field);
      });
      if (newFieldNode) {
        this.__fieldNode = newFieldNode;
        this.__updateRequiredState(this.__fieldNode.required);
        this.__fieldNodeObserver.observe(this.__fieldNode, { attributes: true, attributeFilter: ['required'] });

        if (this.__labelNode) {
          this.__linkLabelToField(this.__fieldNode);
        }
      }
    }

    /** @private */
    __updateRequiredState(required) {
      if (required) {
        this.setAttribute('required', '');
        this.__fieldNode.addEventListener('blur', this.__updateInvalidState);
        this.__fieldNode.addEventListener('change', this.__updateInvalidState);
      } else {
        this.removeAttribute('invalid');
        this.removeAttribute('required');
        this.__fieldNode.removeEventListener('blur', this.__updateInvalidState);
        this.__fieldNode.removeEventListener('change', this.__updateInvalidState);
      }
    }

    /** @private */
    __updateInvalidState() {
      const isValid = this.__getValidateFunction(this.__fieldNode).call(this.__fieldNode);
      this.toggleAttribute('invalid', isValid === false);
    }
  };
