/**
 * @license
 * Copyright (c) 2019 - 2020 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0 (CVDLv4).
 * See <a href="https://vaadin.com/license/cvdl-4.0">the website</a> for the complete license.
 */
import { CheckboxElement } from '@vaadin/vaadin-checkbox/src/vaadin-checkbox.js';

/**
 * The cell editor checkbox element.
 *
 * ### Styling
 *
 * See [`<vaadin-checkbox>` documentation](https://github.com/vaadin/vaadin-checkbox/blob/master/src/vaadin-checkbox.html)
 * for `<vaadin-checkbox>` parts.
 *
 * See [ThemableMixin – how to apply styles for shadow parts](https://github.com/vaadin/vaadin-themable-mixin/wiki)
 */
class GridProEditCheckboxElement extends CheckboxElement {
  static get is() {
    return 'vaadin-grid-pro-edit-checkbox';
  }
}

customElements.define(GridProEditCheckboxElement.is, GridProEditCheckboxElement);
