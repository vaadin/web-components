/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { DirMixin } from '@vaadin/component-base/src/dir-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';
import { GridSorterMixin } from './vaadin-grid-sorter-mixin.js';

/**
 * LitElement based version of `<vaadin-grid-sorter>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 * Feel free to try this code in your apps as per Apache 2.0 license.
 */
class GridSorter extends GridSorterMixin(ThemableMixin(DirMixin(PolylitMixin(LitElement)))) {
  static get is() {
    return 'vaadin-grid-sorter';
  }

  /** @protected */
  render() {
    return html`
      <div part="content">
        <slot></slot>
      </div>
      <div part="indicators">
        <span part="order">${this._getDisplayOrder(this._order)}</span>
      </div>
    `;
  }
}

defineCustomElement(GridSorter);

export { GridSorter };
