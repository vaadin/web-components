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
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Select } from '@vaadin/select/src/vaadin-select.js';
import { GridProEditSelectMixin } from './vaadin-grid-pro-edit-select-mixin.js';

/**
 * An element used internally by `<vaadin-grid-pro>`. Not intended to be used separately.
 *
 * @customElement
 * @extends Select
 * @mixes GridProEditSelectMixin
 * @private
 */
class GridProEditSelect extends GridProEditSelectMixin(Select) {
  static get is() {
    return 'vaadin-grid-pro-edit-select';
  }
}

defineCustomElement(GridProEditSelect);
