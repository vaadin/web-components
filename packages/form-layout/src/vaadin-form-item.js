/**
 * @license
 * Copyright (c) 2017 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { addValueToAttribute, removeValueFromAttribute } from '@vaadin/field-base/src/utils.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

/**
 * `<vaadin-form-item>` is a Web Component providing labelled form item wrapper
 * for using inside `<vaadin-form-layout>`.
 *
 * `<vaadin-form-item>` accepts a single child as the input content,
 * and also has a separate named `label` slot:
 *
 * ```html
 * <vaadin-form-item>
 *   <label slot="label">Label aside</label>
 *   <input>
 * </vaadin-form-item>
 * ```
 *
 * The label is optional and can be omitted:
 *
 * ```html
 * <vaadin-form-item>
 *   <input type="checkbox"> Subscribe to our Newsletter
 * </vaadin-form-item>
 * ```
 *
 * By default, the `label` slot content is displayed aside of the input content.
 * When `label-position="top"` is set, the `label` slot content is displayed on top:
 *
 * ```html
 * <vaadin-form-item label-position="top">
 *   <label slot="label">Label on top</label>
 *   <input>
 * </vaadin-form-item>
 * ```
 *
 * **Note:** Normally, `<vaadin-form-item>` is used as a child of
 * a `<vaadin-form-layout>` element. Setting `label-position` is unnecessary,
 * because the `label-position` attribute is triggered automatically by the parent
 * `<vaadin-form-layout>`, depending on its width and responsive behavior.
 *
 * ### Input Width
 *
 * By default, `<vaadin-form-item>` does not manipulate the width of the slotted
 * input element. Optionally you can stretch the child input element to fill
 * the available width for the input content by adding the `full-width` class:
 *
 * ```html
 * <vaadin-form-item>
 *   <label slot="label">Label</label>
 *   <input class="full-width">
 * </vaadin-form-item>
 * ```
 *
 * ### Styling
 *
 * The `label-position` host attribute can be used to target the label on top state:
 *
 * ```
 * :host([label-position="top"]) {
 *   padding-top: 0.5rem;
 * }
 * ```
 *
 * The following shadow DOM parts are available for styling:
 *
 * Part name | Description
 * ---|---
 * label | The label slot container
 *
 * ### Custom CSS Properties Reference
 *
 * The following custom CSS properties are available on the `<vaadin-form-item>`
 * element:
 *
 * Custom CSS property | Description | Default
 * ---|---|---
 * `--vaadin-form-item-label-width` | Width of the label column when the labels are aside | `8em`
 * `--vaadin-form-item-label-spacing` | Spacing between the label column and the input column when the labels are aside | `1em`
 * `--vaadin-form-item-row-spacing` | Height of the spacing between the form item elements | `1em`
 *
 * See [Styling Components](https://vaadin.com/docs/latest/ds/customization/styling-components) documentation.
 *
 * @extends HTMLElement
 * @mixes ThemableMixin
 */
class FormItem extends ThemableMixin(PolymerElement) {
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          flex-direction: row;
          align-items: baseline;
          margin: calc(0.5 * var(--vaadin-form-item-row-spacing, 1em)) 0;
        }

        :host([label-position='top']) {
          flex-direction: column;
          align-items: stretch;
        }

        :host([hidden]) {
          display: none !important;
        }

        #label {
          width: var(--vaadin-form-item-label-width, 8em);
          flex: 0 0 auto;
        }

        :host([label-position='top']) #label {
          width: auto;
        }

        #spacing {
          width: var(--vaadin-form-item-label-spacing, 1em);
          flex: 0 0 auto;
        }

        #content {
          flex: 1 1 auto;
        }

        #content ::slotted(.full-width) {
          box-sizing: border-box;
          width: 100%;
          min-width: 0;
        }
      </style>
      <div id="label" part="label" on-click="__onLabelClick">
        <slot name="label" id="labelSlot" on-slotchange="__onLabelSlotChange"></slot>
        <span part="required-indicator" aria-hidden="true"></span>
      </div>
      <div id="spacing"></div>
      <div id="content">
        <slot id="contentSlot" on-slotchange="__onContentSlotChange"></slot>
      </div>
    `;
  }

  static get is() {
    return 'vaadin-form-item';
  }

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

    // Ensure every instance has unique ID
    const uniqueId = (FormItem._uniqueLabelId = 1 + FormItem._uniqueLabelId || 0);
    this.__labelId = `label-${this.localName}-${uniqueId}`;
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
      this.__labelNode.id = '';
      this.__labelNode = null;

      if (this.__fieldNode) {
        this.__unlinkLabelFromField(this.__fieldNode);
      }
    }

    const newLabelNode = this.$.labelSlot.assignedElements()[0];
    if (newLabelNode) {
      this.__labelNode = newLabelNode;
      this.__labelNode.id = this.__labelId;

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
Please wrap fields with a <vaadin-custom-field> instead.`
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
}

customElements.define(FormItem.is, FormItem);

export { FormItem };
