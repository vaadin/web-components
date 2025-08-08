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
import './vaadin-board-row.js';
import { css, html, LitElement } from 'lit';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { PolylitMixin } from '@vaadin/component-base/src/polylit-mixin.js';
import { issueWarning } from '@vaadin/component-base/src/warnings.js';
import { BoardRow } from './vaadin-board-row.js';

/**
 * `<vaadin-board>` is a web component to create flexible responsive layouts
 * and build nice looking dashboards.
 *
 * A `<vaadin-board>` is built using `<vaadin-board-row>` elements containing your child elements.
 * Each board row consists of four columns, and can contain up to four elements. Using column spans
 * you can tune the layout to your liking.
 *
 * ```html
 * <vaadin-board>
 *   <vaadin-board-row>
 *     <div>This could be chart 1</div>
 *     <div>This could be chart 2</div>
 *     <div>This could be chart 3</div>
 *     <div>This could be chart 4</div>
 *   </vaadin-board-row>
 * </vaadin-board>
 * ```
 *
 * @customElement vaadin-board
 * @extends HTMLElement
 * @mixes ElementMixin
 * @deprecated `<vaadin-board>` is deprecated and will be removed in Vaadin 26.
 * Consider using `<vaadin-dashboard>` or `<vaadin-dashboard-layout>` as an alternative.
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
  firstUpdated() {
    super.firstUpdated();

    issueWarning(
      '`<vaadin-board>` is deprecated and will be removed in Vaadin 26. Consider using `<vaadin-dashboard>` or `<vaadin-dashboard-layout>` as an alternative.',
    );
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
