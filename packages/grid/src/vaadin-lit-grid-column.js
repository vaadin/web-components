/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { GridColumnMixin } from './vaadin-grid-column-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-column>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class GridColumn extends GridColumnMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-grid-column';
  }
}

defineCustomElement(GridColumn);

export { GridColumn };

export { ColumnBaseMixin } from './vaadin-grid-column-mixin.js';
