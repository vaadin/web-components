/**
 * @license
 * Copyright (c) 2000 - 2025 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import './vaadin-lit-grid-pro-edit-checkbox.js';
import './vaadin-lit-grid-pro-edit-select.js';
import './vaadin-lit-grid-pro-edit-text-field.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-lit-grid-column.js';
import { GridProEditColumnMixin } from './vaadin-grid-pro-edit-column-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-pro-edit-column>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class GridProEditColumn extends GridProEditColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-pro-edit-column';
  }
}

defineCustomElement(GridProEditColumn);

export { GridProEditColumn };
