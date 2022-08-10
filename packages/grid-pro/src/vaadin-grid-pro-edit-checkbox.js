/**
 * @license
 * Copyright (c) 2018 - 2022 Vaadin Ltd.
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { Checkbox } from '@vaadin/checkbox/src/vaadin-checkbox.js';

/**
 * An element used internally by `<vaadin-grid-pro>`. Not intended to be used separately.
 *
 * @extends Checkbox
 * @private
 */
class GridProEditCheckbox extends Checkbox {
  static get is() {
    return 'vaadin-grid-pro-edit-checkbox';
  }
}

customElements.define(GridProEditCheckbox.is, GridProEditCheckbox);
