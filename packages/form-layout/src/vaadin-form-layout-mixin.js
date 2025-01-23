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

        /********** NEW APIS ***********/

        /**
         * Switches to the new layout model,
         * where breakpoints are automatically calculcated
         * based on columnWidth and the layout's width
         * (responsiveSteps is ignored, even if set).
         *
         * Defaults to false for backward compat with old FormLayout.
         *
         * In V25, autoResponsive will default to true and responsiveSteps to null,
         * and the old behavior can be brought back by setting responsiveSteps.
         **/
        autoResponsive: {
          type: Boolean,
          value: false,
        },

        /**
         * The column width.
         * Defaults to 13em, or --vaadin-form-layout-column-width if defined.
         *
         * Has no effect if autoResponsive = false.
         *
         * (In labels-aside mode, the width of the label column, and the space between,
         *  is set separately through css custom properties.)
         */
        columnWidth: {
          type: String,
          value() {
            return getComputedStyle(this).getPropertyValue('--vaadin-form-layout-column-width') || '13em';
          },
          observer: '_columnWidthChanged',
        },

        /**
         * The gap between columns. Defaults to 1em, or --vaadin-form-layout-column-gap if defined.
         *
         * When set via component property, sets the -_vaadin-form-layout-column-gap property on the
         * internal #layout element.
         *
         * (The space between label and field in labels-aside mode is set through a css custom proprety.)
         */
        columnGap: {
          type: String,
          value() {
            return getComputedStyle(this).getPropertyValue('--vaadin-form-layout-column-gap') || '1em';
          },
          observer: '_columnGapChanged',
        },

        /**
         * Max column count.
         */
        maxColumns: {
          type: Number,
          value: 10,
        },

        /**
         * If false, lays each field into a new css-grid-row, unless wrapped into a vaadin-form-row.
         * If true, lays fields into as many columns as are available (like old FormLayout).
         *
         * Defaults to false, or --vaadin-form-layout-default-column if defined, where
         * --vaadin-form-layout-default-column: 1 ==> false
         * --vaadin-form-layout-default-column: auto ==> true
         *
         * Has currently no effect if autoResponsive = false.
         */
        autoRows: {
          type: Boolean,
          value() {
            const defaultColProp =
              getComputedStyle(this).getPropertyValue('--vaadin-form-layout-default-column') || '1';
            return defaultColProp === 'auto';
          },
          reflectToAttribute: true,
        },

        /**
         * Expands columns to fill extra available space in the layout.
         *
         * Possible values:
         * - always: always expand columns
         * - mobile: only expand columns when viewport is smaller than 420px "mobile" breakpoint
         * - never: never expand columns
         *
         * Defaults to 'always', or --vaadin-form-layout-expand-columns, if defined.
         */
        expandColumns: {
          type: String,
          value() {
            return getComputedStyle(this).getPropertyValue('--vaadin-form-layout-expand-columns') || 'always';
          },
          reflectToAttribute: true,
        },

        /**
         * Makes fields scale (grow/shrink) to fit the column.
         *
         * Possible values:
         * - always: always expand columns
         * - mobile: only expand columns when viewport is smaller than 420px "mobile" breakpoint
         * - never: never expand columns
         *
         * Defaults to 'always', or --vaadin-form-layout-fit-fields, if defined.
         */
        fitFields: {
          type: String,
          value() {
            return getComputedStyle(this).getPropertyValue('--vaadin-form-layout-fit-fields') || 'always';
          },
          reflectToAttribute: true,
        },

        /**
         * Sets label position to aside.
         *
         * Ignored if autoResponsive = false; ignored when responsiveSteps used.
         * (Would actually be better if this setting worked as the default for responsiveSteps...)
         */
        labelsAside: {
          type: Boolean,
          value: false,
          reflectToAttribute: true,
          observer() {
            this._generateContainerQueries();
          },
        },
      };
    }

    /** @private */
    _columnWidthChanged() {
      this._generateContainerQueries();
    }

    /** @private */
    _columnGapChanged(colGap) {
      this.$.layout.style.setProperty('--_vaadin-form-layout-column-gap', colGap);
      this._generateContainerQueries();
    }

    /** @protected */
    ready() {
      super.ready();
    }

    constructor() {
      super();

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
    _responsiveStepsChanged(responsiveSteps, oldResponsiveSteps) {
      try {
        if (!this.autoResponsive) {
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

            if (step.labelsPosition !== undefined && ['aside', 'top'].indexOf(step.labelsPosition) === -1) {
              throw new Error(
                `Invalid 'labelsPosition' value of ${step.labelsPosition}, 'aside' or 'top' string is required.`,
              );
            }
          });
          // If valid responsiveSteps set, uses "legacy mode", sets autoRows=false
          this.autoRows = true;
        }
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
      let labelPos;
      let cols;
      let minWidth;
      let firstCol = true;

      // Label col and spacing sizes used in labels-aside-mode:
      // Label col width set either by --vaadin-form-item-label-width or fallback in css
      const labelColWidth = getComputedStyle(this).getPropertyValue('--_label-col-width');
      // Label col spacing set either by --vaadin-form-item-label-width or fallback in css
      const labelColSpacing = getComputedStyle(this).getPropertyValue('--_label-col-spacing');
      // In labels-aside-mode, total layout col width is labelCol + labelColSpacing + fieldCol
      // otherwise simply the columnWidth property's value:
      const totalLayoutColWidth = this.labelsAside
        ? `calc(${labelColWidth} + ${labelColSpacing} + ${this.columnWidth})`
        : this.columnWidth;

      if (this.autoResponsive) {
        // NEW LAYOUT MODEL WITH BREAKPOINTS CALCULATED FROM columnWidth and layout width.
        // Smallest breakpoint at 0 always sets labels-above:
        cqStyles = this._generateBreakpoint('0', 1, 'initial', this.columnWidth);
        for (cols = 1; cols <= this.maxColumns; cols++) {
          labelPos = this.labelsAside ? ' ' : 'initial';
          minWidth = `calc(${cols} * (${totalLayoutColWidth}) + ${cols - 1} * ${this.columnGap})`;
          cqStyles += this._generateBreakpoint(minWidth, cols, labelPos, totalLayoutColWidth);
        }
      } else {
        // LEGACY LAYOUT MODEL WITH BREAKPOINTS BASED ON responsiveSteps.
        this.responsiveSteps.forEach((step) => {
          labelPos = step.labelsPosition === 'top' ? 'initial' : ' ';
          cols = Math.min(this.maxColumns, step.columns);
          // First breakpoint should always be at 0 width
          // (this fixes an issue in old FormLayout that breaks it if it's smaller than smallest step's minWidth)
          minWidth = firstCol ? `0` : step.minWidth;
          cqStyles += this._generateBreakpoint(minWidth, cols, labelPos, this.columnWidth);
          firstCol = false;
        });
      }

      this.$.containerQueries.textContent = cqStyles;
    }

    /** @private */
    _generateBreakpoint(minWidth, columns, labelPos, totalLayoutColWidth) {
      // This sets the css-grid column width to the combined label+space+field width
      // in aside-labels mode, to ensure that the FormLayout doesn't shrink below that:
      const colWidthOverride = totalLayoutColWidth ? `--_vaadin-form-layout-column-width: ${totalLayoutColWidth};` : ``;

      return (
        `@container form-grid (min-width: ${minWidth}) { #layout {` +
        `--_grid-cols: ${columns};` +
        `--_vaadin-form-layout-label-position: ${labelPos};` +
        `${colWidthOverride}}}\n`
      );
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
      /**
       * TODO: Iterate through children of vaadin-form-row and vaadin-form-section as well.
       */
      Array.from(this.children)
        .filter((child) => child.localName === 'br' || getComputedStyle(child).display !== 'none')
        .forEach((child) => {
          /**
           * Forces the column to 1 at <br>, so that the following field
           * is rendered on a new line.
           * TODO: This also needs to apply to elements following a vaadin-form-row and vaadin-form-section.
           */
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
