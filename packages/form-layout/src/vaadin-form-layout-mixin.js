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

        /**
         * Current number of columns in the layout
         * @private
         */
        _columnCount: {
          type: Number,
          sync: true,
        },

        /**
         * Indicates that labels are on top
         * @private
         */
        _labelsOnTop: {
          type: Boolean,
          sync: true,
        },

        /** @private */
        __isVisible: {
          type: Boolean,
        },
      };
    }

    static get observers() {
      return ['_invokeUpdateLayout(_columnCount, _labelsOnTop)'];
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

      this.addEventListener('animationend', this.__onAnimationEnd);
    }

    constructor() {
      super();

      this._styleElement = document.createElement('style');
      // Ensure there is a child text node in the style element
      this._styleElement.textContent = ' ';

      this.__intersectionObserver = new IntersectionObserver((entries) => {
        // If the browser is busy (e.g. due to slow rendering), multiple entries can
        // be queued and then passed to the callback invocation at once. Make sure we
        // use the most recent entry to detect whether the layout is visible or not.
        // See https://github.com/vaadin/web-components/issues/8564
        const entry = [...entries].pop();
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

      requestAnimationFrame(() => this._selectResponsiveStep());
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

      this._selectResponsiveStep();
    }

    /** @private */
    __onAnimationEnd(e) {
      if (e.animationName.indexOf('vaadin-form-layout-appear') === 0) {
        this._selectResponsiveStep();
      }
    }

    /** @private */
    _selectResponsiveStep() {
      // Iterate through responsiveSteps and choose the step
      let selectedStep;
      const tmpStyleProp = 'background-position';
      this.responsiveSteps.forEach((step) => {
        // Convert minWidth to px units for comparison
        this.$.layout.style.setProperty(tmpStyleProp, step.minWidth);
        const stepMinWidthPx = parseFloat(getComputedStyle(this.$.layout).getPropertyValue(tmpStyleProp));

        // Compare step min-width with the host width, select the passed step
        if (stepMinWidthPx <= this.offsetWidth) {
          selectedStep = step;
        }
      });
      this.$.layout.style.removeProperty(tmpStyleProp);

      // Sometimes converting units is not possible, e.g, when element is
      // not connected. Then the `selectedStep` stays `undefined`.
      if (selectedStep) {
        // Apply the chosen responsive step's properties
        this._columnCount = selectedStep.columns;
        this._labelsOnTop = selectedStep.labelsPosition === 'top';
      }
    }

    /** @private */
    _invokeUpdateLayout() {
      this._updateLayout();
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

      /*
        The item width formula:

            itemWidth = colspan / columnCount * 100% - columnSpacing

        We have to subtract columnSpacing, because the column spacing space is taken
        by item margins of 1/2 * spacing on both sides
      */

      const style = getComputedStyle(this);
      const columnSpacing = style.getPropertyValue('--vaadin-form-layout-column-spacing');

      const direction = style.direction;
      const marginStartProp = `margin-${direction === 'ltr' ? 'left' : 'right'}`;
      const marginEndProp = `margin-${direction === 'ltr' ? 'right' : 'left'}`;

      const containerWidth = this.offsetWidth;

      let col = 0;
      Array.from(this.children)
        .filter((child) => child.localName === 'br' || getComputedStyle(child).display !== 'none')
        .forEach((child, index, children) => {
          if (child.localName === 'br') {
            // Reset column count on line break
            col = 0;
            return;
          }

          const attrColspan = child.getAttribute('colspan') || child.getAttribute('data-colspan');
          let colspan;
          colspan = this._naturalNumberOrOne(parseFloat(attrColspan));

          // Never span further than the number of columns
          colspan = Math.min(colspan, this._columnCount);

          const childRatio = colspan / this._columnCount;

          // Note: using 99.9% for 100% fixes rounding errors in MS Edge
          // (< v16), otherwise the items might wrap, resizing is wobbly.
          child.style.width = `calc(${childRatio * 99.9}% - ${1 - childRatio} * ${columnSpacing})`;

          if (col + colspan > this._columnCount) {
            // Too big to fit on this row, let's wrap it
            col = 0;
          }

          // At the start edge
          if (col === 0) {
            child.style.setProperty(marginStartProp, '0px');
          } else {
            child.style.removeProperty(marginStartProp);
          }

          const nextIndex = index + 1;
          const nextLineBreak = nextIndex < children.length && children[nextIndex].localName === 'br';

          // At the end edge
          if (col + colspan === this._columnCount) {
            child.style.setProperty(marginEndProp, '0px');
          } else if (nextLineBreak) {
            const colspanRatio = (this._columnCount - col - colspan) / this._columnCount;
            child.style.setProperty(
              marginEndProp,
              `calc(${colspanRatio * containerWidth}px + ${colspanRatio} * ${columnSpacing})`,
            );
          } else {
            child.style.removeProperty(marginEndProp);
          }

          // Move the column counter
          col = (col + colspan) % this._columnCount;

          if (child.localName === 'vaadin-form-item') {
            if (this._labelsOnTop) {
              if (child.getAttribute('label-position') !== 'top') {
                child.__useLayoutLabelPosition = true;
                child.setAttribute('label-position', 'top');
              }
            } else if (child.__useLayoutLabelPosition) {
              delete child.__useLayoutLabelPosition;
              child.removeAttribute('label-position');
            }
          }
        });
    }

    /**
     * @protected
     * @override
     */
    _onResize() {
      this._selectResponsiveStep();
    }
  };
