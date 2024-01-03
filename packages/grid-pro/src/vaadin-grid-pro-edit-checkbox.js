/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { Checkbox } from '@vaadin/checkbox/src/vaadin-checkbox.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';

/**
 * An element used internally by `<vaadin-grid-pro>`. Not intended to be used separately.
 *
 * @customElement
 * @extends Checkbox
 * @private
 */
class GridProEditCheckbox extends Checkbox {
  static get is() {
    return 'vaadin-grid-pro-edit-checkbox';
  }
}

defineCustomElement(GridProEditCheckbox);
