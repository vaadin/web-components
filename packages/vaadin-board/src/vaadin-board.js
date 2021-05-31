/**
 * @license
 * Copyright (c) 2017 - 2021 Vaadin Ltd
 * This program is available under Commercial Vaadin Developer License 4.0, available at https://vaadin.com/license/cvdl-4.0.
 */
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { IronResizableBehavior } from '@polymer/iron-resizable-behavior/iron-resizable-behavior.js';
import { ElementMixin } from '@vaadin/vaadin-element-mixin/vaadin-element-mixin.js';
import '@vaadin/vaadin-license-checker/vaadin-license-checker.js';
import './vaadin-board-row.js';

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
class BoardElement extends ElementMixin(mixinBehaviors([IronResizableBehavior], PolymerElement)) {
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

  static get version() {
    return '20.0.0';
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
      licenseChecker(BoardElement);
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

customElements.define(BoardElement.is, BoardElement);

export { BoardElement };
