/**
 * @license
 * Copyright (c) 2016 - 2026 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { html, render } from 'lit';

/**
 * A mixin providing rendering of body rows.
 */
export const BodyRenderingMixin = (superClass) =>
  class BodyRenderingMixin extends superClass {
    /** @private */
    __createBodyRow() {
      const renderRoot = document.createDocumentFragment();
      render(this.#bodyRowTemplate(), renderRoot, { host: this });

      const row = renderRoot.firstElementChild;
      row.__renderRoot = renderRoot;
      return row;
    }

    /** @private */
    __renderBodyRow(row) {
      const item = this.__getRowItem(row);
      render(this.#bodyRowTemplate({ item }), row.__renderRoot, { host: this });
    }

    #bodyRowTemplate = ({ item } = {}) => {
      return html`<tr role="row" tabindex="-1" part="row body-row" class="row body-row" ?loading="${!item}"></tr>`;
    };
  };
