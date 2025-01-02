/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { GridColumnGroupMixin } from './vaadin-grid-column-group-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-column-group>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class GridColumnGroup extends GridColumnGroupMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-grid-column-group';
  }
}

defineCustomElement(GridColumnGroup);

export { GridColumnGroup };
