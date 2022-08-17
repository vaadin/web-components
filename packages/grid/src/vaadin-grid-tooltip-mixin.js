/**
 * @license
 * Copyright (c) 2016 - 2022 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { TooltipHostMixin } from '@vaadin/tooltip/src/vaadin-tooltip-host-mixin.js';

/**
 * @polymerMixin
 */
export const TooltipMixin = (superClass) =>
  class TooltipMixin extends TooltipHostMixin(superClass) {
    static get properties() {
      return {
        /**
         * A function that allows generating tooltips for individual grid cells
         * based on their row and column. The return value should be a string.
         * If an empty string is returned, no tooltip is shown for the cell.
         *
         * Receives two arguments:
         * - `column` The `<vaadin-grid-column>` element (`undefined` for details-cell).
         * - `model` The object with the properties related with
         *   the rendered item, contains:
         *   - `model.index` The index of the item.
         *   - `model.item` The item.
         *   - `model.expanded` Sublevel toggle state.
         *   - `model.level` Level of the tree represented with a horizontal offset of the toggle button.
         *   - `model.selected` Selected state.
         */
        cellTooltipGenerator: Function,
      };
    }

    /** @protected */
    ready() {
      super.ready();

      // Disable auto-added event listeners
      this._tooltipController.setManual(true);

      this.addEventListener('mousemove', (event) => {
        if (typeof this.cellTooltipGenerator !== 'function') {
          return;
        }

        const targetCell = event
          .composedPath()
          .find(
            (node) =>
              node.nodeType === Node.ELEMENT_NODE &&
              node.hasAttribute('part') &&
              node.getAttribute('part').includes('cell'),
          );

        if (targetCell) {
          const model = this.__getRowModel(targetCell.parentElement);
          const tooltipText = this.cellTooltipGenerator(targetCell._column, model);

          this._tooltipController.setTarget(targetCell);
          this._tooltipController.setTooltipText(tooltipText);
          this._tooltipController.setOpened(!!tooltipText);
        }
      });

      this.addEventListener('mouseleave', () => {
        this._tooltipController.setOpened(false);
      });
    }
  };
