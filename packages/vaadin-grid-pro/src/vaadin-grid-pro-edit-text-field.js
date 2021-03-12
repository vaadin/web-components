/**
 * @license
 * Copyright (c) 2019 - 2020 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */
import { TextFieldElement } from '@vaadin/vaadin-text-field/src/vaadin-text-field.js';

/**
 * The cell editor text-field element.
 *
 * ### Styling
 *
 * See [`<vaadin-text-field>` documentation](https://github.com/vaadin/vaadin-text-field/blob/master/src/vaadin-text-field.html)
 * for `<vaadin-text-field>` parts.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
class GridProEditTextFieldElement extends TextFieldElement {
  static get is() {
    return 'vaadin-grid-pro-edit-text-field';
  }

  ready() {
    super.ready();
    this.setAttribute('theme', 'grid-pro-editor');
  }
}

customElements.define(GridProEditTextFieldElement.is, GridProEditTextFieldElement);
