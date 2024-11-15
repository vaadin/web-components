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
import './vaadin-crud-edit.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { GridColumn } from '@vaadin/grid/src/vaadin-grid-column.js';
import { CrudEditColumnMixin } from './vaadin-crud-edit-column-mixin.js';

/**
 *
 */
class CrudEditColumn extends CrudEditColumnMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-crud-edit-column';
  }
}
defineCustomElement(CrudEditColumn);
export { CrudEditColumn };
