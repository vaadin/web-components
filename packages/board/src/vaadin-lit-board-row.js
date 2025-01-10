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
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { BoardRowMixin } from './vaadin-board-row-mixin.js';

/**
 * LitElement based version of `<vaadin-board-row>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class BoardRow extends BoardRowMixin(ElementMixin(PolylitMixin(LitElement))) {
  static get is() {
    return 'vaadin-board-row';
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-flow: row wrap;
        align-items: stretch;
        --small-size: var(--vaadin-board-width-small, 600px);
        --medium-size: var(--vaadin-board-width-medium, 960px);
      }

      :host([hidden]) {
        display: none !important;
      }

      :host ::slotted(*) {
        box-sizing: border-box;
        flex-grow: 1;
        overflow: hidden;
      }
    `;
  }

  /** @protected */
  render() {
    return html`<slot id="insertionPoint"></slot>`;
  }
}

defineCustomElement(BoardRow);

export { BoardRow };
