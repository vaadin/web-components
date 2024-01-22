/**
 * @license
 * Copyright (c) 2016 - 2024 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-grid-filter.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridFilterColumnMixin } from './vaadin-grid-filter-column-mixin.js';
import { GridColumn } from './vaadin-lit-grid-column.js';

/**
 * LitElement based version of `<vaadin-grid-filter-column>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class GridFilterColumn extends GridFilterColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-filter-column';
  }
}

defineCustomElement(GridFilterColumn);

export { GridFilterColumn };
