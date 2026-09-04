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
      fragment.appendChild(document.createComment(' vaadin-grid-row-start '));
      fragment.appendChild(document.createComment(' vaadin-grid-row-end '));
      this.__renderBodyRow(fragment, fragment.lastChild);
      return fragment;
    }

    /** @private */
    __renderBodyRow(container, renderBefore, index) {
      return render(this.#renderBodyRow(index), container, {
        renderBefore,
        host: this,
      });
    }

    #renderBodyRow = (index) => {
      return html`<tr role="row" tabindex="-1" part="row body-row" class="row body-row" .index="${index}"></tr>`;
    };
  };
