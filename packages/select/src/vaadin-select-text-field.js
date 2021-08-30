/**
 * @license
 * Copyright (c) 2021 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';

/**
 * An element used internally by `<vaadin-select>`. Not intended to be used separately.
 *
 * @extends TextFieldElement
 * @protected
 */
class SelectTextFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-select-text-field';
  }

  /** @protected */
  get focusElement() {
    return this.shadowRoot.querySelector('[part=input-field]');
  }

  /** @protected */
  get inputElement() {
    return this.shadowRoot.querySelector('input');
  }
}

customElements.define(SelectTextFieldElement.is, SelectTextFieldElement);
