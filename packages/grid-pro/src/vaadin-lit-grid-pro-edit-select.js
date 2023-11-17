/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Select } from '@vaadin/select/src/vaadin-lit-select.js';
import { GridProEditSelectMixin } from './vaadin-grid-pro-edit-select-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-pro-edit-select>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment not intended for publishing to npm.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class GridProEditSelect extends GridProEditSelectMixin(Select) {
  static get is() {
    return 'vaadin-grid-pro-edit-select';
  }
}

defineCustomElement(GridProEditSelect);
