/**
 * @license
 * Copyright (c) 2000 - 2024 Vaadin Ltd.
 *
 * This program is available under Vaadin Commercial License and Service Terms.
 *
 *
 * See https://vaadin.com/commercial-license-and-service-terms for the full
 * license.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { isElementHidden } from '@vaadin/a11y-base/src/focus-utils.js';
import { defineCustomElement } from '@vaadin/component-base/src/define.js';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

const CLASSES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
};

/**
 * `<vaadin-board-row>` is a web component that together with `<vaadin-board>` component allows
 * to create flexible responsive layouts and build nice looking dashboard.
 *
 * Each row can contain up to four elements (fewer if colspan is used) and is automatically responsive.
 * The row changes between `large`, `medium` and `small` modes depending on the available width and
 * the set breakpoints.
 *
 * In `large` mode, typically all content is shown side-by-side, in `medium` half of the content is
 * side by side and in `small` mode, content is laid out vertically.
 *
 * The breakpoints can be set using custom CSS properties.
 * By default the breakpoints are `small: <600px`, `medium: < 960px`, `large >= 960px`.
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
 * ### Styling
 *
 * The following custom properties are available for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|-------------
 * `--vaadin-board-width-small` | Determines the width where mode changes from `small` to `medium` | `600px`
 * `--vaadin-board-width-medium` | Determines the width where mode changes from `medium` to `large` | `960px`
 *
 * @customElement
 * @extends HTMLElement
 * @mixes ElementMixin
 * @mixes ResizeMixin
 */
class BoardRow extends ResizeMixin(ElementMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex-flow: row wrap;
          align-items: stretch;
          --small-size: var(--vaadin-board-width-small, 600px);
          --medium-size: var(--vaadin-board-width-medium, 960px);
        }

        :host ::slotted(*) {
          box-sizing: border-box;
          flex-grow: 1;
          overflow: hidden;
        }
      </style>
      <slot id="insertionPoint"></slot>
    `;
  }

  static get is() {
    return 'vaadin-board-row';
  }

  constructor() {
    super();
    this._oldWidth = 0;
    this._oldBreakpoints = { smallSize: 600, mediumSize: 960 };
    this._oldFlexBasis = [];
  }

  /** @protected */
  ready() {
    super.ready();

    this.$.insertionPoint.addEventListener('slotchange', () => this.redraw());
  }

  /** @protected */
  connectedCallback() {
    super.connectedCallback();
    this._onResize();
  }

  /**
   * Adds styles for board row based on width.
   * @private
   */
  _addStyleNames(width, breakpoints) {
    if (width < breakpoints.smallSize) {
      this.classList.add(CLASSES.SMALL);
      this.classList.remove(CLASSES.MEDIUM);
      this.classList.remove(CLASSES.LARGE);
    } else if (width < breakpoints.mediumSize) {
      this.classList.remove(CLASSES.SMALL);
      this.classList.add(CLASSES.MEDIUM);
      this.classList.remove(CLASSES.LARGE);
    } else {
      this.classList.remove(CLASSES.SMALL);
      this.classList.remove(CLASSES.MEDIUM);
      this.classList.add(CLASSES.LARGE);
    }
  }

  /**
   * Calculates flex basis based on colSpan, width and breakpoints.
   * @param {number} colSpan colspan value of the row
   * @param {number} width width of the row in px
   * @param {number} colsInRow number of columns in the row
   * @param {object} breakpoints object with smallSize and mediumSize number properties, which tells
   * where the row should switch rendering size in pixels.
   * @private
   */
  _calculateFlexBasis(colSpan, width, colsInRow, breakpoints) {
    if (width < breakpoints.smallSize) {
      colsInRow = 1;
    } else if (width < breakpoints.mediumSize && colsInRow === 4) {
      colsInRow = 2;
    }
    let flexBasis = (colSpan / colsInRow) * 100;
    flexBasis = flexBasis > 100 ? 100 : flexBasis;
    return `${flexBasis}%`;
  }

  /** @private */
  _reportError() {
    const errorMessage = 'The column configuration is not valid; column count should add up to 3 or 4.';
    console.warn(errorMessage, `check: \r\n${this.outerHTML}`);
  }

  /**
   * Parses board-cols from DOM.
   * If there is not enough space in the row drop board cols.
   * @param {!Array<!Node>} nodes array of nodes
   * @return {!Array<number>} array of boardCols
   * @private
   */
  _parseBoardCols(nodes) {
    const boardCols = nodes.map((node) => {
      if (node.getAttribute('board-cols')) {
        return parseInt(node.getAttribute('board-cols'));
      }
      return 1;
    });

    let spaceLeft = 4;
    let returnBoardCols = [];
    nodes.forEach((_node, i) => {
      spaceLeft -= boardCols[i];
    });

    if (spaceLeft < 0) {
      this._reportError();
      boardCols.forEach((_node, i) => {
        returnBoardCols[i] = 1;
      });
    } else {
      returnBoardCols = boardCols.slice(0);
    }

    return returnBoardCols;
  }

  /**
   * If there is not enough space in the row.
   * Extra items are dropped from DOM.
   * @param {!Array<number>} boardCols array of board-cols for every node
   * @param {!Array<!Node>} nodes array of nodes
   * @return {!Array<!Node>} filtered array of nodes
   * @private
   */
  _removeExtraNodesFromDOM(boardCols, nodes) {
    let isErrorReported = false;
    let spaceLeft = 4;
    const returnNodes = [];
    nodes.forEach((node, i) => {
      spaceLeft -= boardCols[i];
      if (spaceLeft < 0) {
        if (!isErrorReported) {
          isErrorReported = true;
          this._reportError();
        }
        this.removeChild(node);
      } else {
        returnNodes[i] = node;
      }
    });
    return returnNodes;
  }

  /**
   * Redraws the row, if necessary.
   *
   * In most cases, a board row will redraw itself if your reconfigure it.
   * If you dynamically change breakpoints
   * --vaadin-board-width-small or --vaadin-board-width-medium,
   * then you need to call this method.
   */
  redraw() {
    this._recalculateFlexBasis(true);
  }

  /**
   * @protected
   * @override
   */
  _onResize() {
    this._recalculateFlexBasis(false);
  }

  /** @private */
  _recalculateFlexBasis(forceResize) {
    const width = this.getBoundingClientRect().width;
    const breakpoints = this._measureBreakpointsInPx();
    if (forceResize || this._shouldRecalculate(width, breakpoints)) {
      const nodes = this.$.insertionPoint.assignedNodes({ flatten: true });
      const filteredNodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE);
      this._addStyleNames(width, breakpoints);
      const boardCols = this._parseBoardCols(filteredNodes);
      const colsInRow = boardCols.reduce((a, b) => a + b, 0);
      this._removeExtraNodesFromDOM(boardCols, filteredNodes).forEach((e, i) => {
        const newFlexBasis = this._calculateFlexBasis(boardCols[i], width, colsInRow, breakpoints);
        if (forceResize || !this._oldFlexBasis[i] || this._oldFlexBasis[i] !== newFlexBasis) {
          this._oldFlexBasis[i] = newFlexBasis;
          e.style.flexBasis = newFlexBasis;
        }
      });
      this._oldWidth = width;
      this._oldBreakpoints = breakpoints;
    }
  }

  /** @private */
  _shouldRecalculate(width, breakpoints) {
    // Should not recalculate if row is invisible
    if (isElementHidden(this)) {
      return false;
    }
    return (
      width !== this._oldWidth ||
      breakpoints.smallSize !== this._oldBreakpoints.smallSize ||
      breakpoints.mediumSize !== this._oldBreakpoints.mediumSize
    );
  }

  /**
   * Measure the breakpoints in pixels.
   *
   * The breakpoints for `small` and `medium` can be given in any unit: `px`, `em`, `in` etc.
   * We need to know them in `px` so that they are comparable with the actual size.
   *
   * @return {object} object with smallSize and mediumSize number properties, which tells
   * where the row should switch rendering size in pixels.
   * @private
   */
  _measureBreakpointsInPx() {
    // Convert minWidth to px units for comparison
    const breakpoints = {};
    const tmpStyleProp = 'background-position';
    const smallSize = getComputedStyle(this).getPropertyValue('--small-size');
    const mediumSize = getComputedStyle(this).getPropertyValue('--medium-size');
    this.style.setProperty(tmpStyleProp, smallSize);
    breakpoints.smallSize = parseFloat(getComputedStyle(this).getPropertyValue(tmpStyleProp));
    this.style.setProperty(tmpStyleProp, mediumSize);
    breakpoints.mediumSize = parseFloat(getComputedStyle(this).getPropertyValue(tmpStyleProp));
    this.style.removeProperty(tmpStyleProp);
    return breakpoints;
  }
}

defineCustomElement(BoardRow);

export { BoardRow };
