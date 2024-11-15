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
 * LitElement based version of `<vaadin-crud-edit-column>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class CrudEditColumn extends CrudEditColumnMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-crud-edit-column';
  }
}
defineCustomElement(CrudEditColumn);
export { CrudEditColumn };
