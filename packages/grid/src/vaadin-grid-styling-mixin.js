/**
 * @license
 * Copyright (c) 2016 - 2025 Vaadin Ltd.
 * This program is available under Apache License Version 2.0, available at https://vaadin.com/license/
 */
import { iterateChildren, iterateRowCells, updatePart } from './vaadin-grid-helpers.js';

/**
 * @polymerMixin
 */
export const StylingMixin = (superClass) =>
  class StylingMixin extends superClass {
    static get properties() {
      return {
        /**
         * A function that allows generating CSS class names for grid cells
         * based on their row and column. The return value should be the generated
         * class name as a string, or multiple class names separated by whitespace
         * characters.
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
         *
         * @type {GridCellClassNameGenerator | null | undefined}
         * @deprecated Use `cellPartNameGenerator` instead.
         */
        cellClassNameGenerator: {
          type: Function,
          sync: true,
        },

        /**
         * A function that allows generating CSS `part` names for grid cells in Shadow DOM based
         * on their row and column, for styling from outside using the `::part()` selector.
         *
         * The return value should be the generated part name as a string, or multiple part names
         * separated by whitespace characters.
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
         *
         * @type {GridCellPartNameGenerator | null | undefined}
         */
        cellPartNameGenerator: {
          type: Function,
          sync: true,
        },
      };
    }

    static get observers() {
      return [
        '__cellClassNameGeneratorChanged(cellClassNameGenerator)',
        '__cellPartNameGeneratorChanged(cellPartNameGenerator)',
      ];
    }

    /** @private */
    __cellClassNameGeneratorChanged() {
      this.generateCellClassNames();
    }

    /** @private */
    __cellPartNameGeneratorChanged() {
      this.generateCellPartNames();
    }

    /**
     * Runs the `cellClassNameGenerator` for the visible cells.
     * If the generator depends on varying conditions, you need to
     * call this function manually in order to update the styles when
     * the conditions change.
     *
     * @deprecated Use `cellPartNameGenerator` and `generateCellPartNames()` instead.
     */
    generateCellClassNames() {
      iterateChildren(this.$.items, (row) => {
        if (!row.hidden) {
          this._generateCellClassNames(row, this.__getRowModel(row));
        }
      });
    }

    /**
     * Runs the `cellPartNameGenerator` for the visible cells.
     * If the generator depends on varying conditions, you need to
     * call this function manually in order to update the styles when
     * the conditions change.
     */
    generateCellPartNames() {
      iterateChildren(this.$.items, (row) => {
        if (!row.hidden) {
          this._generateCellPartNames(row, this.__getRowModel(row));
        }
      });
    }

    /** @private */
    _generateCellClassNames(row, model) {
      iterateRowCells(row, (cell) => {
        if (cell.__generatedClasses) {
          cell.__generatedClasses.forEach((className) => cell.classList.remove(className));
        }
        if (this.cellClassNameGenerator && !row.hasAttribute('loading')) {
          const result = this.cellClassNameGenerator(cell._column, model);
          cell.__generatedClasses = result && result.split(' ').filter((className) => className.length > 0);
          if (cell.__generatedClasses) {
            cell.__generatedClasses.forEach((className) => cell.classList.add(className));
          }
        }
      });
    }

    /** @private */
    _generateCellPartNames(row, model) {
      iterateRowCells(row, (cell) => {
        if (cell.__generatedParts) {
          cell.__generatedParts.forEach((partName) => {
            // Remove previously generated part names
            updatePart(cell, null, partName);
          });
        }
        if (this.cellPartNameGenerator && !row.hasAttribute('loading')) {
          const result = this.cellPartNameGenerator(cell._column, model);
          cell.__generatedParts = result && result.split(' ').filter((partName) => partName.length > 0);
          if (cell.__generatedParts) {
            cell.__generatedParts.forEach((partName) => {
              // Add the newly generated names to part
              updatePart(cell, true, partName);
            });
          }
        }
      });
    }
  };
