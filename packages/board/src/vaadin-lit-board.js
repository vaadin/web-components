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
import './vaadin-lit-board-row.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { BoardRow } from './vaadin-lit-board-row.js';

/**
 * LitElement based version of `<vaadin-board>` web component.
 *
 * ## Disclaimer
 *
 * This component is an experiment and not yet a part of Vaadin platform.
 * There is no ETA regarding specific Vaadin version where it'll land.
 */
class Board extends ElementMixin(PolylitMixin(LitElement)) {
  static get is() {
    return 'vaadin-board';
  }

  static get cvdlName() {
    return 'vaadin-board';
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none !important;
      }
    `;
  }

  /** @protected */
  render() {
    return html`<slot></slot>`;
  }

  /**
   * Redraws the board and all rows inside it, if necessary.
   *
   * In most cases, board will redraw itself if your reconfigure it. If you dynamically change
   * breakpoints `--vaadin-board-width-small` or `--vaadin-board-width-medium`,
   * then you need to call this method.
   */
  redraw() {
    [...this.querySelectorAll('*')].filter((node) => node instanceof BoardRow).forEach((row) => row.redraw());
  }
}

defineCustomElement(Board);

export { Board };
