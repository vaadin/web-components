/**
 * @license
 * Copyright (c) 2017 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { isElementHidden } from '@vaadin/a11y-base/src/focus-utils.js';
import { ResizeMixin } from '@vaadin/component-base/src/resize-mixin.js';

/**
 * @polymerMixin
 * @mixes ResizeMixin
 */
export const FormLayoutMixin = (superClass) =>
  class extends ResizeMixin(superClass) {
    static get properties() {
      return {
        /**
         * @typedef FormLayoutResponsiveStep
         * @type {object}
         * @property {string} minWidth - The threshold value for this step in CSS length units.
         * @property {number} columns - Number of columns. Only natural numbers are valid.
         * @property {string} labelsPosition - Labels position option, valid values: `"aside"` (default), `"top"`.
         */

        /**
         * Allows specifying a responsive behavior with the number of columns
         * and the label position depending on the layout width.
         *
         * Format: array of objects, each object defines one responsive step
         * with `minWidth` CSS length, `columns` number, and optional
         * `labelsPosition` string of `"aside"` or `"top"`. At least one item is required.
         *
         * #### Examples
         *
         * ```javascript
         * formLayout.responsiveSteps = [{columns: 1}];
         * // The layout is always a single column, labels aside.
         * ```
         *
         * ```javascript
         * formLayout.responsiveSteps = [
         *   {minWidth: 0, columns: 1},
         *   {minWidth: '40em', columns: 2}
         * ];
         * // Sets two responsive steps:
         * // 1. When the layout width is < 40em, one column, labels aside.
         * // 2. Width >= 40em, two columns, labels aside.
         * ```
         *
         * ```javascript
         * formLayout.responsiveSteps = [
         *   {minWidth: 0, columns: 1, labelsPosition: 'top'},
         *   {minWidth: '20em', columns: 1},
         *   {minWidth: '40em', columns: 2}
         * ];
         * // Default value. Three responsive steps:
         * // 1. Width < 20em, one column, labels on top.
         * // 2. 20em <= width < 40em, one column, labels aside.
         * // 3. Width >= 40em, two columns, labels aside.
         * ```
         *
         * @type {!Array<!FormLayoutResponsiveStep>}
         */
        responsiveSteps: {
          type: Array,
          value() {
            return [
              { minWidth: 0, columns: 1, labelsPosition: 'top' },
              { minWidth: '20em', columns: 1 },
              { minWidth: '40em', columns: 2 },
            ];
          },
          observer: '_responsiveStepsChanged',
          sync: true,
        },

        /** @private */
        __isVisible: {
          type: Boolean,
        },
      };
    }

    /** @protected */
    ready() {
      // Here we attach a style element that we use for validating
      // CSS values in `responsiveSteps`. We can't add this to the `<template>`,
      // because Polymer will throw it away. We need to create this before
      // `super.ready()`, because `super.ready()` invokes property observers,
      // and the observer for `responsiveSteps` does CSS value validation.
      this.appendChild(this._styleElement);

      super.ready();
    }

    constructor() {
      super();

      this._styleElement = document.createElement('style');
      // Ensure there is a child text node in the style element
      this._styleElement.textContent = ' ';

      this.__intersectionObserver = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
          // Prevent possible jump when layout becomes visible
          this.$.layout.style.opacity = 0;
        }
        if (!this.__isVisible && entry.isIntersecting) {
          this._updateLayout();
          this.$.layout.style.opacity = '';
        }
        this.__isVisible = entry.isIntersecting;
      });
    }

    /** @protected */
    connectedCallback() {
      super.connectedCallback();

      requestAnimationFrame(() => this._updateLayout());

      this._observeChildrenColspanChange();
      this.__intersectionObserver.observe(this.$.layout);
    }

    /** @protected */
    disconnectedCallback() {
      super.disconnectedCallback();

      this.__mutationObserver.disconnect();
      this.__childObserver.disconnect();
      this.__intersectionObserver.disconnect();
    }

    /** @private */
    _observeChildrenColspanChange() {
      // Observe changes in form items' `colspan` attribute and update styles
      const mutationObserverConfig = { attributes: true };

      this.__mutationObserver = new MutationObserver((mutationRecord) => {
        mutationRecord.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            (mutation.attributeName === 'colspan' ||
              mutation.attributeName === 'data-colspan' ||
              mutation.attributeName === 'hidden')
          ) {
            this._updateLayout();
          }
        });
      });

      // Observe changes to initial children
      [...this.children].forEach((child) => {
        this.__mutationObserver.observe(child, mutationObserverConfig);
      });

      // Observe changes to lazily added nodes
      this.__childObserver = new MutationObserver((mutations) => {
        const addedNodes = [];
        const removedNodes = [];

        mutations.forEach((mutation) => {
          addedNodes.push(...this._getObservableNodes(mutation.addedNodes));
          removedNodes.push(...this._getObservableNodes(mutation.removedNodes));
        });

        addedNodes.forEach((child) => {
          this.__mutationObserver.observe(child, mutationObserverConfig);
        });

        if (addedNodes.length > 0 || removedNodes.length > 0) {
          this._updateLayout();
        }
      });

      this.__childObserver.observe(this, { childList: true });
    }

    /** @private */
    _getObservableNodes(nodeList) {
      const ignore = ['template', 'style', 'dom-repeat', 'dom-if'];
      return Array.from(nodeList).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE && ignore.indexOf(node.localName.toLowerCase()) === -1,
      );
    }

    /** @private */
    _naturalNumberOrOne(n) {
      if (typeof n === 'number' && n >= 1 && n < Infinity) {
        return Math.floor(n);
      }
      return 1;
    }

    /** @private */
    _isValidCSSLength(value) {
      // Let us choose a CSS property for validating CSS <length> values:
      // - `border-spacing` accepts `<length> | inherit`, it's the best! But
      //   it does not disallow invalid values at all in MSIE :-(
      // - `letter-spacing` and `word-spacing` accept
      //   `<length> | normal | inherit`, and disallows everything else, like
      //   `<percentage>`, `auto` and such, good enough.
      // - `word-spacing` is used since its shorter.

      // Disallow known keywords allowed as the `word-spacing` value
      if (value === 'inherit' || value === 'normal') {
        return false;
      }

      // Use the value in a stylesheet and check the parsed value. Invalid
      // input value results in empty parsed value.
      this._styleElement.firstChild.nodeValue = `#styleElement { word-spacing: ${value}; }`;

      if (!this._styleElement.sheet) {
        // Stylesheet is not ready, probably not attached to the document yet.
        return true;
      }

      // Safari 9 sets invalid CSS rules' value to `null`
      return ['', null].indexOf(this._styleElement.sheet.cssRules[0].style.getPropertyValue('word-spacing')) < 0;
    }

    /** @private */
    _responsiveStepsChanged(responsiveSteps, oldResponsiveSteps) {
      try {
        if (!Array.isArray(responsiveSteps)) {
          throw new Error('Invalid "responsiveSteps" type, an Array is required.');
        }

        if (responsiveSteps.length < 1) {
          throw new Error('Invalid empty "responsiveSteps" array, at least one item is required.');
        }

        responsiveSteps.forEach((step) => {
          if (this._naturalNumberOrOne(step.columns) !== step.columns) {
            throw new Error(`Invalid 'columns' value of ${step.columns}, a natural number is required.`);
          }

          if (step.minWidth !== undefined && !this._isValidCSSLength(step.minWidth)) {
            throw new Error(`Invalid 'minWidth' value of ${step.minWidth}, a valid CSS length required.`);
          }

          if (step.labelsPosition !== undefined && ['aside', 'top'].indexOf(step.labelsPosition) === -1) {
            throw new Error(
              `Invalid 'labelsPosition' value of ${step.labelsPosition}, 'aside' or 'top' string is required.`,
            );
          }
        });
      } catch (e) {
        if (oldResponsiveSteps && oldResponsiveSteps !== responsiveSteps) {
          console.warn(`${e.message} Using previously set 'responsiveSteps' instead.`);
          this.responsiveSteps = oldResponsiveSteps;
        } else {
          console.warn(`${e.message} Using default 'responsiveSteps' instead.`);
          this.responsiveSteps = [
            { minWidth: 0, columns: 1, labelsPosition: 'top' },
            { minWidth: '20em', columns: 1 },
            { minWidth: '40em', columns: 2 },
          ];
        }
      }

      this._generateContainerQueries();
    }

    /** @private */
    _generateContainerQueries() {
      let cqStyles = '';
      this.responsiveSteps.forEach((step) => {
        const formItemAlign = step.labelsPosition === 'top' ? 'stretch' : 'baseline';
        const formItemFlexDir = step.labelsPosition === 'top' ? 'column' : 'row';
        const breakpoint =
          `@container form-grid (min-width: ${step.minWidth}) { #layout {` +
          `--_grid-cols: ${step.columns};` +
          `--_vaadin-form-item-align-items: ${formItemAlign};` +
          `--_vaadin-form-item-flex-dir: ${formItemFlexDir};` +
          `}}\n`;
        cqStyles += breakpoint;
      });
      this.$.containerQueries.textContent = cqStyles;
    }

    /**
     * Update the layout.
     * @protected
     */
    _updateLayout() {
      // Do not update layout when invisible
      if (isElementHidden(this)) {
        return;
      }

      let resetColumn = false;
      Array.from(this.children)
        .filter((child) => child.localName === 'br' || getComputedStyle(child).display !== 'none')
        .forEach((child) => {
          if (child.localName === 'br') {
            resetColumn = true;
          } else {
            /* colspan attribute to css property */
            const attrColspan = child.getAttribute('colspan') || child.getAttribute('data-colspan');
            const colspan = this._naturalNumberOrOne(parseInt(attrColspan));
            if (colspan > 1) child.style.setProperty('--vaadin-form-layout-colspan', colspan);

            /* Forces the next element after a <br> to render in column 1 */
            if (resetColumn) {
              child.style.setProperty('--_vaadin-form-layout-start-col', '1');
              resetColumn = false;
            }
          }
        });
    }
  };
