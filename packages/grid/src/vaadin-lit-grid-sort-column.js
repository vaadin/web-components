/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import './vaadin-lit-grid-sorter.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { GridSortColumnMixin } from './vaadin-grid-sort-column-mixin.js';
import { GridColumn } from './vaadin-lit-grid-column.js';

/**
 * LitElement based version of `<vaadin-grid-sort-column>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class GridSortColumn extends GridSortColumnMixin(GridColumn) {
  static get is() {
    return 'vaadin-grid-sort-column';
  }
}

defineCustomElement(GridSortColumn);

export { GridSortColumn };
