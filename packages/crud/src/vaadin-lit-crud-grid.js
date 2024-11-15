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
import '@vaadin/grid/src/vaadin-grid-column-group.js';
import '@vaadin/grid/src/vaadin-grid-column.js';
import '@vaadin/grid/src/vaadin-grid-filter.js';
import '@vaadin/grid/src/vaadin-grid-sorter.js';
import './vaadin-crud-edit-column.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { Grid } from '@vaadin/grid/src/vaadin-grid.js';
import { CrudGridMixin } from './vaadin-crud-grid-mixin.js';

/**
 * LitElement based version of `<vaadin-crud-grid>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class CrudGrid extends CrudGridMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-crud-grid';
  }
}
defineCustomElement(CrudGrid);
export { CrudGrid };
