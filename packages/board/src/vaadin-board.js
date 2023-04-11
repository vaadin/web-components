/**
 * @license
 * Copyright (c) 2000 - 2023 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import './vaadin-board-row.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';

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
 * @extends HTMLElement
 * @mixes ElementMixin
 */
class Board extends ElementMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <slot></slot>
    `;
  }

  static get is() {
    return 'vaadin-board';
  }

  /**
   * @protected
   */
  static _finalizeClass() {
    super._finalizeClass();

    const devModeCallback = window.Vaadin.developmentModeCallback;
    const licenseChecker = devModeCallback && devModeCallback['vaadin-license-checker'];
    /* c8 ignore next 3 */
    if (typeof licenseChecker === 'function') {
      licenseChecker(Board);
    }
  }

  /**
   * Redraws the board and all rows inside it, if necessary.
   *
   * In most cases, board will redraw itself if your reconfigure it. If you dynamically change CSS
   * which affects this element, then you need to call this method.
   */
  redraw() {
    this.notifyResize();
  }
}

customElements.define(Board.is, Board);

export { Board };
