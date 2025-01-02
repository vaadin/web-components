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
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { Grid } from '@vaadin/grid/src/vaadin-lit-grid.js';
import { InlineEditingMixin } from './vaadin-grid-pro-inline-editing-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-pro>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class GridPro extends InlineEditingMixin(Grid) {
  static get is() {
    return 'vaadin-grid-pro';
  }

  static get cvdlName() {
    return 'vaadin-grid-pro';
  }
}

defineCustomElement(GridPro);

export { GridPro };
