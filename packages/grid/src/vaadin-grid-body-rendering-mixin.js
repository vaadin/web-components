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
      const fragment = document.createDocumentFragment();
      const endMarker = fragment.appendChild(document.createComment(''));

      const litPart = render(this.#bodyRowTemplate(), fragment, {
        host: this,
        renderBefore: endMarker,
      });

      const row = fragment.firstElementChild;
      row.__startMarker = litPart.startNode;
      row.__endMarker = endMarker;
      return row;
    }

    /** @private */
    __renderBodyRow(row, index) {
      render(this.#bodyRowTemplate(index), row.parentNode, {
        host: this,
        renderBefore: row.__endMarker,
      });
    }

    #bodyRowTemplate = (index) => {
      return html`<tr role="row" tabindex="-1" part="row body-row" class="row body-row" .index="${index}"></tr>`;
    };
  };
